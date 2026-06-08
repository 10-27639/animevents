'use client'
import { useState, useTransition } from 'react'
import type { Event } from '@/types/domain'
import { GENRE_LABELS } from '@/types/domain'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateEventStatus } from '@/actions/admin'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Pencil, ExternalLink } from 'lucide-react'

type Props = { events: Event[] }

export function QueueTable({ events }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function handle(eventId: string, action: 'approve' | 'reject') {
    setProcessingId(eventId)
    startTransition(async () => {
      try {
        await updateEventStatus(eventId, action, 'admin')
        router.refresh()
      } finally {
        setProcessingId(null)
      }
    })
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        レビュー待ちのイベントはありません
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const isProcessing = isPending && processingId === event.id
        const conf = event.confidence ?? 0

        return (
          <div key={event.id} className="border rounded-lg p-4 space-y-3 bg-card">
            {/* ヘッダー行 */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-medium leading-snug">{event.title}</p>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Badge variant="outline" className="text-xs">
                    {GENRE_LABELS[event.genre]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {event.prefecture} / {event.venue ?? '会場未定'}
                  </span>
                </div>
              </div>

              {/* confidence スコア */}
              <div className="text-right shrink-0">
                <div
                  className={`text-lg font-mono font-medium ${
                    conf >= 0.75 ? 'text-green-600' :
                    conf >= 0.5  ? 'text-amber-500' :
                                   'text-red-500'
                  }`}
                >
                  {Math.round(conf * 100)}
                </div>
                <div className="text-xs text-muted-foreground">score</div>
              </div>
            </div>

            {/* 生テキスト（折りたたみ） */}
            {event.raw_text && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  収集テキストを見る
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap break-all">
                  {event.raw_text}
                </pre>
              </details>
            )}

            {/* フッター行 */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    ソース
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="inline-flex items-center h-7 gap-1 px-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  編集
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => handle(event.id, 'reject')}
                  className="text-red-600 hover:text-red-600"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  却下
                </Button>
                <Button
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => handle(event.id, 'approve')}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  承認
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
