-- works: アニメ・漫画・ゲームなどの作品
create table works (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  title_kana  text,
  genre       text,                         -- anime / manga / game / other
  image_url   text,
  created_at  timestamptz default now()
);

-- organizers: 主催者・サークル情報
create table organizers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text,
  twitter     text,
  created_at  timestamptz default now()
);

-- events: 聖地巡礼イベント本体
create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  work_id       uuid references works(id),
  organizer_id  uuid references organizers(id),
  venue         text,
  prefecture    text,
  starts_at     timestamptz,
  ends_at       timestamptz,
  entry_url     text,
  image_url     text,
  status        text default 'draft',       -- draft / published / cancelled
  tags          text[],
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- subscriptions: メール通知購読
create table subscriptions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  prefecture  text,
  work_ids    uuid[],
  created_at  timestamptz default now()
);
