import { revalidatePath } from 'next/cache'

// Cron 完了後に呼ぶ — イベント一覧キャッシュを即時パージ
export function purgeEventCache() {
  revalidatePath('/events', 'page')
  revalidatePath('/', 'page')
}

// 個別イベント更新時（管理画面の承認・却下後）
export function purgeEventDetailCache(id: string) {
  revalidatePath(`/events/${id}`, 'page')
}
