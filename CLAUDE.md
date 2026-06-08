@AGENTS.md

# animevents — AI旅日記 (Next.js + Supabase)

## プロジェクト概要
アニメ聖地巡礼イベント情報を収集・管理・公開するWebアプリ。
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (DB / Auth / Storage)
- Claude API (イベント情報の自動要約・タグ付け)

## フォルダ構成

```
app/(site)/          ← 一般公開ルート
app/(admin)/admin/   ← 管理者ルート
app/api/             ← Route Handlers
components/ui/       ← shadcn生成（手動編集禁止）
components/events/
components/admin/
lib/supabase/        ← client.ts / server.ts
lib/claude/
lib/crawler/
types/
actions/
supabase/migrations/
```

## テーブル設計

テーブル: `events` / `works` / `organizers` / `subscriptions`
マイグレーション: `supabase/migrations/001_initial.sql`

## 環境変数 (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

## 開発コマンド

```bash
npm run dev        # localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # 本番ビルド
```

## 実装ステップ

### Step 1 — 基盤セットアップ ✅
- create-next-app 初期化
- フォルダ構成整備
- lib/supabase/client.ts / server.ts
- supabase/migrations/001_initial.sql
- Supabase 接続確認

### Step 2 — 型定義 & マイグレーション適用
### Step 3 — 公開サイト基本UI
### Step 4 — 管理画面
### Step 5 — Claude API 連携
### Step 6 — クローラー
### Step 7 — 通知機能
