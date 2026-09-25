-- Cumulative snapshots and per-change deltas become hypertables partitioned by captured_at.
-- create_default_indexes is off: every index the tables need is declared in the Prisma schema,
-- so `prisma migrate dev` never sees an index it does not know about and never tries to drop it.

SELECT create_hypertable(
  'account_snapshot',
  by_range('captured_at', INTERVAL '7 days'),
  create_default_indexes => FALSE,
  if_not_exists => TRUE,
  migrate_data => TRUE
);

SELECT create_hypertable(
  'tank_snapshot',
  by_range('captured_at', INTERVAL '3 days'),
  create_default_indexes => FALSE,
  if_not_exists => TRUE,
  migrate_data => TRUE
);

SELECT create_hypertable(
  'tank_battle_delta',
  by_range('captured_at', INTERVAL '1 day'),
  create_default_indexes => FALSE,
  if_not_exists => TRUE,
  migrate_data => TRUE
);

-- Compression settings can only be set while no chunk is compressed, so they are applied once.
DO $$
DECLARE
  target RECORD;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('account_snapshot', 'account_id, mode'),
      ('tank_snapshot', 'account_id, mode'),
      ('tank_battle_delta', 'tank_id, mode')
    ) AS t(relation, segment_by)
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM timescaledb_information.hypertables
      WHERE hypertable_name = target.relation AND compression_enabled
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I SET (timescaledb.compress, timescaledb.compress_segmentby = %L, timescaledb.compress_orderby = %L)',
        target.relation,
        target.segment_by,
        'captured_at DESC'
      );
    END IF;
  END LOOP;
END
$$;
