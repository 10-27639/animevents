import { Suspense } from 'react'
import { getEvents } from '@/actions/events'
import { EventCard } from '@/components/events/event-card'
import { EventFilters } from '@/components/events/event-filters'
import type { EventGenre, Prefecture } from '@/types/domain'

export const revalidate = 3600

type Props = {
  searchParams: Promise<{
    prefecture?: string
    genre?: string
    is_free?: string
    page?: string
  }>
}

export default async function EventsPage({ searchParams }: Props) {
  const sp = await searchParams
  const { events, total } = await getEvents({
    prefecture: sp.prefecture as Prefecture | undefined,
    genre:      sp.genre as EventGenre | undefined,
    is_free:    sp.is_free === 'true' ? true : undefined,
    page:       Number(sp.page ?? 1),
    limit:      24,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">イベント一覧</h1>
        <span className="text-sm text-muted-foreground">{total} 件</span>
      </div>

      <div className="mb-6">
        <Suspense>
          <EventFilters />
        </Suspense>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          該当するイベントが見つかりませんでした
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
