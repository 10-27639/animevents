import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { EventEditForm } from '@/components/admin/event-edit-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { Event } from '@/types/domain'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function EditPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          QA キューに戻る
        </Link>
      </div>

      <div className="mb-6 space-y-1">
        <h1 className="text-lg font-medium">イベント編集</h1>
        <p className="text-xs text-muted-foreground font-mono">
          confidence: {Math.round((event.confidence ?? 0) * 100)} / 100
        </p>
      </div>

      <EventEditForm event={event as Event} />
    </div>
  )
}
