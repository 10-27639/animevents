import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-sm text-muted-foreground">イベントが見つかりませんでした</p>
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
      >
        一覧に戻る
      </Link>
    </div>
  )
}
