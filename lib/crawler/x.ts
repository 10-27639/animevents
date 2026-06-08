// X API v2 クローラ
// Bearer Token は TWITTER_BEARER_TOKEN 環境変数から取得
// Phase 1 では API キーがなくてもモックデータで動作する

export interface RawItem {
  rawText: string
  sourceUrl: string
  sourceType: 'x'
}

const SEARCH_QUERIES = [
  'アニメ イベント 開催 -RT',
  '原画展 開催決定 -RT',
  '声優 イベント 京都 OR 大阪 OR 神戸 -RT',
  'コラボカフェ オープン 関西 -RT',
]

export async function fetchXPosts(): Promise<RawItem[]> {
  const token = process.env.TWITTER_BEARER_TOKEN
  if (!token) {
    console.warn('[x] TWITTER_BEARER_TOKEN 未設定 — スキップ')
    return []
  }

  const items: RawItem[] = []

  for (const query of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({
        query,
        max_results:    '10',
        'tweet.fields': 'created_at,entities',
      })
      const res = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 0 },
        },
      )
      if (!res.ok) {
        console.error('[x] API エラー:', res.status, await res.text())
        continue
      }
      const json = await res.json() as {
        data?: Array<{ id: string; text: string }>
      }
      for (const tweet of json.data ?? []) {
        items.push({
          rawText:    tweet.text,
          sourceUrl:  `https://x.com/i/web/status/${tweet.id}`,
          sourceType: 'x',
        })
      }
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.error('[x] fetchXPosts エラー:', err)
    }
  }

  return items
}
