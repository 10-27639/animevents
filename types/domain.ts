export type EventGenre = 'anime' | 'manga' | 'game' | 'other'
export type Prefecture =
  | 'hokkaido' | 'aomori' | 'iwate' | 'miyagi' | 'akita' | 'yamagata' | 'fukushima'
  | 'ibaraki' | 'tochigi' | 'gunma' | 'saitama' | 'chiba' | 'tokyo' | 'kanagawa'
  | 'niigata' | 'toyama' | 'ishikawa' | 'fukui' | 'yamanashi' | 'nagano'
  | 'shizuoka' | 'aichi' | 'mie' | 'gifu'
  | 'shiga' | 'kyoto' | 'osaka' | 'hyogo' | 'nara' | 'wakayama'
  | 'tottori' | 'shimane' | 'okayama' | 'hiroshima' | 'yamaguchi'
  | 'tokushima' | 'kagawa' | 'ehime' | 'kochi'
  | 'fukuoka' | 'saga' | 'nagasaki' | 'kumamoto' | 'oita' | 'miyazaki' | 'kagoshima' | 'okinawa'

export interface Event {
  id: string
  title: string
  description: string | null
  venue: string | null
  prefecture: Prefecture | null
  starts_at: string
  ends_at: string | null
  entry_url: string | null
  image_url: string | null
  status: 'draft' | 'published' | 'cancelled'
  genre: EventGenre
  is_featured: boolean
  is_free: boolean
  tags: string[] | null
  address: string | null
  ticket_url: string | null
  source_url: string | null
  work_ids: string[] | null
  confidence: number | null
  raw_text: string | null
  created_at: string
  updated_at: string
}

export type AdminAction = 'approve' | 'reject' | 'edit'

export interface ExtractedEventData {
  title: string
  venue: string | null
  address: string | null
  prefecture: string | null
  starts_at: string | null
  ends_at: string | null
  genre: string
  is_free: boolean
  ticket_url: string | null
  work_names: string[]
  confidence: number
  confidence_reason: string
}

export const GENRE_LABELS: Record<EventGenre, string> = {
  anime: 'アニメ',
  manga: '漫画',
  game:  'ゲーム',
  other: 'その他',
}

export const PREFECTURE_LABELS: Record<Prefecture, string> = {
  hokkaido: '北海道', aomori: '青森', iwate: '岩手', miyagi: '宮城',
  akita: '秋田', yamagata: '山形', fukushima: '福島',
  ibaraki: '茨城', tochigi: '栃木', gunma: '群馬', saitama: '埼玉',
  chiba: '千葉', tokyo: '東京', kanagawa: '神奈川',
  niigata: '新潟', toyama: '富山', ishikawa: '石川', fukui: '福井',
  yamanashi: '山梨', nagano: '長野',
  shizuoka: '静岡', aichi: '愛知', mie: '三重', gifu: '岐阜',
  shiga: '滋賀', kyoto: '京都', osaka: '大阪', hyogo: '兵庫',
  nara: '奈良', wakayama: '和歌山',
  tottori: '鳥取', shimane: '島根', okayama: '岡山', hiroshima: '広島',
  yamaguchi: '山口',
  tokushima: '徳島', kagawa: '香川', ehime: '愛媛', kochi: '高知',
  fukuoka: '福岡', saga: '佐賀', nagasaki: '長崎', kumamoto: '熊本',
  oita: '大分', miyazaki: '宮崎', kagoshima: '鹿児島', okinawa: '沖縄',
}
