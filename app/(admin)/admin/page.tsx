import { getQueuedEvents } from '@/actions/admin'
import { QueueTable } from '@/components/admin/queue-table'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const events = await getQueuedEvents()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">QA キュー</h1>
        <span className="text-sm text-muted-foreground">
          {events.length} 件 レビュー待ち
        </span>
      </div>
      <QueueTable events={events} />
    </div>
  )
}
