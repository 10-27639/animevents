-- events テーブルにパイプライン用カラムを追加
alter table events
  add column source_type  text,
  add column extracted_at timestamptz;

-- works テーブルにエイリアスを追加（クローラーの作品名マッチング用）
alter table works
  add column name_ja    text,
  add column name_alias text[];
