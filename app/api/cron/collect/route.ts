import { createServiceClient } from '@/lib/supabase/server'
import { extractEventsBatch } from '@/lib/claude/extract'
import { fetchPrTimes } from '@/lib/crawler/scraper'
import { fetchXPosts } from '@/lib/crawler/x'
import { ok, err, API_ERRORS } from '@/lib/api'
import { purgeEventCache } from '@/lib/cache'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: Request) {
  // Vercel Cron 認証
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return err(API_ERRORS.FORBIDDEN.message, API_ERRORS.FORBIDDEN.code, 403)
  }

  // 1. 複数ソースから収集
  const [prItems, xItems] = await Promise.all([
    fetchPrTimes(),
    fetchXPosts(),
  ])
  const rawItems = [...prItems, ...xItems]
  console.log(`[cron] 収集件数: ${rawItems.length}`)

  if (rawItems.length === 0) {
    return ok({ inserted: 0, queued: 0, rejected: 0, total: 0 })
  }

  // 2. Claude API で構造化抽出
  const extracted = rawItems.map((item) => ({
  title:             item.rawText.split('\n')[0]?.slice(0, 80) ?? 'タイトル未設定',
  venue:             null,
  address:           null,
  prefecture:        'osaka',
  starts_at:         new Date().toISOString(),
  ends_at:           null,
  genre:             'other' as const,
  is_free:           false,
  ticket_url:        null,
  work_names:        [],
  confidence:        0.6,
  confidence_reason: '手動レビュー待ち',
}))

  // 3. スコアに応じて DB に書き込み
  const supabase = createServiceClient()
  let inserted = 0
  let queued   = 0
  let rejected = 0

  for (let i = 0; i < extracted.length; i++) {
    const item = extracted[i]
    if (!item?.title) { rejected++; continue }

    // 閾値判定（'live' は 'published' に対応）
    const status: 'published' | 'draft' | null =
      item.confidence >= 0.85 ? 'published' :
      item.confidence >= 0.50 ? 'draft'     :
      null

    if (!status) { rejected++; continue }

    // work_names → work_ids 変換
    let work_ids: string[] = []
    if (item.work_names.length > 0) {
      const { data: works } = await supabase
        .from('works')
        .select('id, title')
        .in('title', item.work_names)
      work_ids = (works ?? []).map((w: { id: string }) => w.id)
    }

    const raw = rawItems[i]!
    const { error } = await supabase.from('events').upsert({
      title:        item.title,
      venue:        item.venue,
      address:      item.address,
      prefecture:   item.prefecture ?? 'osaka',
      starts_at:    item.starts_at  ?? new Date().toISOString(),
      ends_at:      item.ends_at,
      genre:        item.genre,
      is_free:      item.is_free,
      ticket_url:   item.ticket_url,
      work_ids:     work_ids.length > 0 ? work_ids : null,
      source_url:   raw.sourceUrl,
      source_type:  raw.sourceType,
      raw_text:     raw.rawText,
      confidence:   item.confidence,
      extracted_at: new Date().toISOString(),
      status,
    }, {
      onConflict:       'source_url',
      ignoreDuplicates: false,
    })

    if (error) {
      console.error('[cron] upsert エラー:', error.message)
    } else {
      status === 'published' ? inserted++ : queued++
    }
  }

  console.log(`[cron] 完了 — inserted:${inserted} queued:${queued} rejected:${rejected}`)
  purgeEventCache()
  return ok({ inserted, queued, rejected, total: rawItems.length })
}
