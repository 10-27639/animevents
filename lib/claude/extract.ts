import Anthropic from '@anthropic-ai/sdk'
import type { ExtractedEventData } from '@/types/domain'

const client = new Anthropic()

const SYSTEM_PROMPT = `あなた�Eアニメ・漫画イベント情報の抽出専門家です、E与えられたテキストからイベント情報を抽出し、厳寁E��JSON形式で返してください、E
## 抽出ルール
- starts_at / ends_at は ISO 8601 形式（侁E "2026-07-01T10:00:00+09:00"�E�E- 時刻が不�Eな場合�E日付�Eみ�E�侁E "2026-07-01"�E�E- prefecture は英語キーのみ: kyoto, osaka, hyogo, tokyo, aichi, fukuoka など
- genre は: art_exhibition / voice_actor / collab_store / merchandise / convention / screening / other
- confidence は 0.0、E.0 の数値
- confidence_reason は QA拁E��老E��けに日本語で根拠を簡潔に書ぁE- イベント情報が含まれなぁE��合�E confidence めE0.1 以下にする
- JSONのみ返す。前置きや説明�E一刁E��要`

function buildPrompt(rawText: string, sourceUrl: string): string {
  return `以下�EチE��ストからアニメ・漫画イベント情報を抽出してください、E
【情報ソース、EURL: ${sourceUrl}

【テキスト、E${rawText.slice(0, 1500)}

【�E力形式、E{
  "title": "イベント名",
  "venue": "会場吁Eor null",
  "address": "住所 or null",
  "prefecture": "都道府県キー or null",
  "starts_at": "ISO8601 or null",
  "ends_at": "ISO8601 or null",
  "genre": "ジャンルキー",
  "is_free": true,
  "ticket_url": "URL or null",
  "work_names": ["作品吁E],
  "confidence": 0.0,
  "confidence_reason": "根拠"
}`
}

export async function extractEventFromText(
  rawText: string,
  sourceUrl: string,
): Promise<ExtractedEventData | null> {
  try {
    const message = await client.messages.create({
      model:      'claude-haiku-4-5',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: buildPrompt(rawText, sourceUrl) }],
    })

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed  = JSON.parse(cleaned) as ExtractedEventData

    if (!parsed.title || typeof parsed.confidence !== 'number') {
      console.error('[extract] 忁E��フィールド欠搁E', parsed)
      return null
    }
    return parsed
  } catch (err) {
    console.error('[extract] Claude API エラー:', err)
    return null
  }
}

export async function extractEventsBatch(
  items: Array<{ rawText: string; sourceUrl: string }>,
): Promise<Array<ExtractedEventData | null>> {
  const results: Array<ExtractedEventData | null> = []
  for (const item of items) {
    await new Promise((r) => setTimeout(r, 1000))
    results.push(await extractEventFromText(item.rawText, item.sourceUrl))
  }
  return results
}
