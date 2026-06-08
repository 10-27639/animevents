import type { Event } from '@/types/domain'
import { GENRE_LABELS } from '@/types/domain'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

type Props = { event: Event }

export function EventCard({ event }: Props) {
  const start = new Date(event.starts_at).toLocaleDateString('ja-JP', {
    month: 'long', day: 'numeric', weekday: 'short',
  })
  const end = event.ends_at
    ? new Date(event.ends_at).toLocaleDateString('ja-JP', {
        month: 'long', day: 'numeric',
      })
    : null

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-snug line-clamp-2">
              {event.title}
            </h3>
            {event.is_featured && (
              <Badge variant="secondary" className="shrink-0 text-xs">PR</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {GENRE_LABELS[event.genre]}
            </Badge>
            {event.is_free && (
              <Badge className="text-xs bg-green-100 text-green-800 border-0">無料</Badge>
            )}
          </div>
          {event.venue && (
            <p className="text-xs text-muted-foreground truncate">{event.venue}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {start}{end ? ` — ${end}` : ''}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
