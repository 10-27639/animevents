alter table events
  add column genre       text,
  add column is_featured boolean default false,
  add column is_free     boolean default false;
