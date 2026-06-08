import * as cheerio from 'cheerio'

export interface RawItem {
  rawText: string
  sourceUrl: string
  sourceType: 'official' | 'pressrelease'
}

// PR TIMES のアニメカテゴリをクロール
export async function fetchPrTimes(): Promise<RawItem[]> {
  const url = 'https://prtimes.jp/topics/keywords/アニメ'
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnimeventsBot/1.0)' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)
    const items: RawItem[] = []

    $('article, .list-article, .article-item').each((_, el) => {
      const title   = $(el).find('h2, h3, .title').first().text().trim()
      const body    = $(el).find('p, .summary, .description').first().text().trim()
      const href    = $(el).find('a').first().attr('href') ?? ''
      const fullUrl = href.startsWith('http') ? href : `https://prtimes.jp${href}`

      if (title.length > 10) {
        items.push({
          rawText:    `${title}\n${body}`,
          sourceUrl:  fullUrl,
          sourceType: 'pressrelease',
        })
      }
    })

    return items.slice(0, 20)
  } catch (err) {
    console.error('[scraper] fetchPrTimes エラー:', err)
    return []
  }
}

// 公式サイト URL を直接指定してテキスト抽出
export async function fetchOfficialPage(url: string): Promise<RawItem | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnimeventsBot/1.0)' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)

    // script / style / nav を除去してテキスト抽出
    $('script, style, nav, header, footer').remove()
    const rawText = $('main, article, .content, body')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000)

    if (rawText.length < 50) return null
    return { rawText, sourceUrl: url, sourceType: 'official' }
  } catch (err) {
    console.error('[scraper] fetchOfficialPage エラー:', err)
    return null
  }
}
