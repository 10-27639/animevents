import type { Event } from '@/types/domain'
import { GENRE_LABELS } from '@/types/domain'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MapPin, Calendar, Tag } from 'lucide-react'

type Props = { event: Event }

export function EventDetail({ event }: Props) {
  const start = new Date(event.starts_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  const end = event.ends_at
    ? new Date(event.ends_at).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
      })
    : null

  return (
    <article className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* ヘッダー */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{GENRE_LABELS[event.genre]}</Badge>
          {event.is_free && (
            <Badge className="bg-green-100 text-green-800 border-0">無料</Badge>
          )}
          {event.is_featured && (
            <Badge variant="secondary">PR</Badge>
          )}
        </div>
        <h1 className="text-xl font-medium leading-snug">{event.title}</h1>
      </div>

      {/* 基本情報 */}
      <dl className="space-y-4">
        <div className="flex gap-3">
          <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <dt className="text-xs text-muted-foreground mb-0.5">開催期間</dt>
            <dd className="text-sm">
              {start}
              {end && <><br /><span className="text-muted-foreground">〜 </span>{end}</>}
            </dd>
          </div>
        </div>

        {(event.venue || event.address) && (
          <div className="flex gap-3">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground mb-0.5">会場</dt>
              <dd className="text-sm">
                {event.venue}
                {event.address && (
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {event.address}
                  </span>
                )}
              </dd>
            </div>
          </div>
        )}

        {event.work_ids && event.work_ids.length > 0 && (
          <div className="flex gap-3">
            <Tag className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <dt className="text-xs text-muted-foreground mb-0.5">関連作品</dt>
              <dd className="flex flex-wrap gap-1 mt-1">
                {event.work_ids.map((id) => (
                  <Badge key={id} variant="secondary" className="text-xs">{id}</Badge>
                ))}
              </dd>
            </div>
          </div>
        )}
      </dl>

      {/* 説明文 */}
      {event.description && (
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap border-t pt-6">
          {event.description}
        </div>
      )}

      {/* CTA */}
      {(event.ticket_url || event.source_url) && (
        <div className="flex flex-wrap gap-3 border-t pt-6">
          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              チケットを購入
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
            >
              公式サイトを見る
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

    </article>
  )
}
