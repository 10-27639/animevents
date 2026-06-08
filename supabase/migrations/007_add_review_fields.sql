alter table events
  add column reviewed_by text,
  add column reviewed_at timestamptz;
