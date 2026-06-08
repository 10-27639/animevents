import { createClient } from '@/lib/supabase/server'
import type { Event, EventGenre, Prefecture } from '@/types/domain'

interface GetEventsOptions {
  prefecture?: Prefecture
  genre?: EventGenre
  is_free?: boolean
  page?: number
  limit?: number
}

export async function getEvents(options: GetEventsOptions = {}): Promise<{ events: Event[]; total: number }> {
  const { prefecture, genre, is_free, page = 1, limit = 24 } = options
  const supabase = await createClient()

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('starts_at', { ascending: true })

  if (prefecture) query = query.eq('prefecture', prefecture)
  if (genre)      query = query.eq('genre', genre)
  if (is_free)    query = query.eq('is_free', true)

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)

  return { events: (data ?? []) as Event[], total: count ?? 0 }
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data as Event
}
