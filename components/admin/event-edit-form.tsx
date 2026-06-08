'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Event, EventGenre, Prefecture } from '@/types/domain'
import { GENRE_LABELS, PREFECTURE_LABELS } from '@/types/domain'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateEventStatus } from '@/actions/admin'

type Props = { event: Event }

export function EventEditForm({ event }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [fields, setFields] = useState({
    title:       event.title,
    venue:       event.venue       ?? '',
    address:     event.address     ?? '',
    prefecture:  event.prefecture  ?? '',
    starts_at:   event.starts_at.slice(0, 16),
    ends_at:     event.ends_at?.slice(0, 16) ?? '',
    genre:       event.genre       ?? 'anime',
    is_free:     event.is_free,
    ticket_url:  event.ticket_url  ?? '',
    description: event.description ?? '',
  })

  function set<K extends keyof typeof fields>(k: K, v: typeof fields[K]) {
    setFields((prev) => ({ ...prev, [k]: v }))
  }

  function handleApprove() {
    startTransition(async () => {
      await updateEventStatus(event.id, 'approve', 'admin')
      router.push('/admin')
      router.refresh()
    })
  }

  function handleReject() {
    startTransition(async () => {
      await updateEventStatus(event.id, 'reject', 'admin')
      router.push('/admin')
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">

      {/* title */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">タイトル</label>
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          value={fields.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      {/* genre + prefecture */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">ジャンル</label>
          <Select value={fields.genre} onValueChange={(v) => set('genre', v as EventGenre)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(GENRE_LABELS) as [EventGenre, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">都道府県</label>
          <Select value={fields.prefecture} onValueChange={(v) => set('prefecture', v as Prefecture)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="選択" /></SelectTrigger>
            <SelectContent>
              {(Object.entries(PREFECTURE_LABELS) as [Prefecture, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* venue + address */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">会場</label>
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          value={fields.venue}
          onChange={(e) => set('venue', e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">住所</label>
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          value={fields.address}
          onChange={(e) => set('address', e.target.value)}
        />
      </div>

      {/* 日程 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">開始日時</label>
          <input
            type="datetime-local"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            value={fields.starts_at}
            onChange={(e) => set('starts_at', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">終了日時</label>
          <input
            type="datetime-local"
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            value={fields.ends_at}
            onChange={(e) => set('ends_at', e.target.value)}
          />
        </div>
      </div>

      {/* is_free */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={fields.is_free}
          onChange={(e) => set('is_free', e.target.checked)}
          className="rounded"
        />
        無料イベント
      </label>

      {/* ticket_url */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">チケット URL</label>
        <input
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
          value={fields.ticket_url}
          onChange={(e) => set('ticket_url', e.target.value)}
        />
      </div>

      {/* description */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">説明文</label>
        <textarea
          rows={4}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
          value={fields.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      {/* actions */}
      <div className="flex gap-3 pt-2 border-t">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={handleReject}
          className="text-red-600 hover:text-red-600"
        >
          却下
        </Button>
        <Button disabled={isPending} onClick={handleApprove} className="ml-auto">
          承認して公開
        </Button>
      </div>
    </div>
  )
}
