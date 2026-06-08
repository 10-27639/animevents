import { notFound } from 'next/navigation'
import { getEventById } from '@/actions/events'
import { EventDetail } from '@/components/events/event-detail'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import type { Metadata } from 'next'

export const revalidate = 300  // 5分

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) return { title: 'イベントが見つかりません' }
  return {
    title: event.title,
    description: event.description ?? undefined,
  }
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          一覧に戻る
        </Link>
      </div>
      <EventDetail event={event} />
    </div>
  )
}
