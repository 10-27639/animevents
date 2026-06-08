import Link from 'next/link'
import { getEvents } from '@/actions/events'
import { EventCard } from '@/components/events/event-card'

export const revalidate = 3600

export default async function Home() {
  const { events } = await getEvents({ limit: 6, page: 1 })

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-medium mb-2">アニメ・漫画イベント</h1>
        <p className="text-sm text-muted-foreground">
          全国のアニメ・漫画イベントを毎日更新
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">直近のイベント</h2>
        <Link href="/events" className="text-sm px-2.5 py-1 rounded-lg hover:bg-muted transition-colors">
          すべて見る →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
