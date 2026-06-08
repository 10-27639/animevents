'use server'
import { createServiceClient } from '@/lib/supabase/server'
import { purgeEventDetailCache } from '@/lib/cache'
import type { Event, AdminAction } from '@/types/domain'

/** イベントのステータスを承認・却下・編集戻しに更新 */
export async function updateEventStatus(
  eventId: string,
  action: AdminAction,
  reviewerId: string,
): Promise<void> {
  const supabase = createServiceClient()

  const statusMap: Record<AdminAction, string> = {
    approve: 'published',
    reject:  'cancelled',
    edit:    'draft',
  }

  const { error } = await supabase
    .from('events')
    .update({
      status:      statusMap[action],
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    })
    .eq('id', eventId)

  if (error) throw new Error(error.message)
  purgeEventDetailCache(eventId)
}

/** draft ステータスのイベントをすべて取得（QA キュー） */
export async function getQueuedEvents(): Promise<Event[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'draft')
    .order('confidence', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Event[]
}
