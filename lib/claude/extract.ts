import Anthropic from '@anthropic-ai/sdk'
import type { ExtractedEventData } from '@/types/domain'

const client = new Anthropic()

const SYSTEM_PROMPT = `縺ゅ↑縺溘・繧｢繝九Γ繝ｻ貍ｫ逕ｻ繧､繝吶Φ繝域ュ蝣ｱ縺ｮ謚ｽ蜃ｺ蟆る摩螳ｶ縺ｧ縺吶・荳弱∴繧峨ｌ縺溘ユ繧ｭ繧ｹ繝医°繧峨う繝吶Φ繝域ュ蝣ｱ繧呈歓蜃ｺ縺励∝宍蟇・↓JSON蠖｢蠑上〒霑斐＠縺ｦ縺上□縺輔＞縲・
## 謚ｽ蜃ｺ繝ｫ繝ｼ繝ｫ
- starts_at / ends_at 縺ｯ ISO 8601 蠖｢蠑擾ｼ井ｾ・ "2026-07-01T10:00:00+09:00"・・- 譎ょ綾縺御ｸ肴・縺ｪ蝣ｴ蜷医・譌･莉倥・縺ｿ・井ｾ・ "2026-07-01"・・- prefecture 縺ｯ闍ｱ隱槭く繝ｼ縺ｮ縺ｿ: kyoto, osaka, hyogo, tokyo, aichi, fukuoka 縺ｪ縺ｩ
- genre 縺ｯ: art_exhibition / voice_actor / collab_store / merchandise / convention / screening / other
- confidence 縺ｯ 0.0縲・.0 縺ｮ謨ｰ蛟､
- confidence_reason 縺ｯ QA諡・ｽ楢・髄縺代↓譌･譛ｬ隱槭〒譬ｹ諡繧堤ｰ｡貎斐↓譖ｸ縺・- 繧､繝吶Φ繝域ュ蝣ｱ縺悟性縺ｾ繧後↑縺・ｴ蜷医・ confidence 繧・0.1 莉･荳九↓縺吶ｋ
- JSON縺ｮ縺ｿ霑斐☆縲ょ燕鄂ｮ縺阪ｄ隱ｬ譏弱・荳蛻・ｸ崎ｦ～

function buildPrompt(rawText: string, sourceUrl: string): string {
  return `莉･荳九・繝・く繧ｹ繝医°繧峨い繝九Γ繝ｻ貍ｫ逕ｻ繧､繝吶Φ繝域ュ蝣ｱ繧呈歓蜃ｺ縺励※縺上□縺輔＞縲・
縲先ュ蝣ｱ繧ｽ繝ｼ繧ｹ縲・URL: ${sourceUrl}

縲舌ユ繧ｭ繧ｹ繝医・${rawText.slice(0, 1500)}

縲仙・蜉帛ｽ｢蠑上・{
  "title": "繧､繝吶Φ繝亥錐",
  "venue": "莨壼ｴ蜷・or null",
  "address": "菴乗園 or null",
  "prefecture": "驛ｽ驕灘ｺ懃恁繧ｭ繝ｼ or null",
  "starts_at": "ISO8601 or null",
  "ends_at": "ISO8601 or null",
  "genre": "繧ｸ繝｣繝ｳ繝ｫ繧ｭ繝ｼ",
  "is_free": true,
  "ticket_url": "URL or null",
  "work_names": ["菴懷刀蜷・],
  "confidence": 0.0,
  "confidence_reason": "譬ｹ諡"
}`
}

export async function extractEventFromText(
  rawText: string,
  sourceUrl: string,
): Promise<ExtractedEventData | null> {
  try {
    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
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
      console.error('[extract] 蠢・医ヵ繧｣繝ｼ繝ｫ繝画ｬ謳・', parsed)
      return null
    }
    return parsed
  } catch (err) {
    console.error('[extract] Claude API 繧ｨ繝ｩ繝ｼ:', err)
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
