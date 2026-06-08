'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GENRE_LABELS, PREFECTURE_LABELS } from '@/types/domain'
import type { EventGenre, Prefecture } from '@/types/domain'

export function EventFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    next.delete('page')
    router.push(`/events?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={params.get('prefecture') ?? 'all'}
        onValueChange={(v) => update('prefecture', v as string)}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="エリア" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全エリア</SelectItem>
          {(Object.entries(PREFECTURE_LABELS) as [Prefecture, string][]).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get('genre') ?? 'all'}
        onValueChange={(v) => update('genre', v as string)}
      >
        <SelectTrigger className="w-44 h-8 text-sm">
          <SelectValue placeholder="ジャンル" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全ジャンル</SelectItem>
          {(Object.entries(GENRE_LABELS) as [EventGenre, string][]).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
