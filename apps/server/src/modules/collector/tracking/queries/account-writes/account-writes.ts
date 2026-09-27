import type { LatestTanksSqlInput, MarksRow, PlayerTankUpsertRow, SyncedRow } from './account-writes.types';

import { Prisma } from '../../../../../../generated';
import { TANK_SNAPSHOT_COLUMNS } from './account-writes.constants';

const toJson = (rows: readonly object[]): string =>
  JSON.stringify(rows, (_, value: unknown) => (typeof value === 'bigint' ? value.toString() : value));

const columns = Prisma.raw(TANK_SNAPSHOT_COLUMNS.join(', '));

const updates = Prisma.raw(
  TANK_SNAPSHOT_COLUMNS.filter((column) => !['account_id', 'mode', 'tank_id'].includes(column))
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(', ')
);

export const upsertPlayerTanksSql = (rows: readonly PlayerTankUpsertRow[]): Prisma.Sql => Prisma.sql`
  INSERT INTO player_tank (account_id, tank_id, battles, wins, mark_of_mastery, last_battle_at, updated_at)
  SELECT r.account_id, r.tank_id, coalesce(r.battles, 0), coalesce(r.wins, 0), coalesce(r.mark_of_mastery, 0), r.last_battle_at, now()
  FROM jsonb_to_recordset(${toJson(
    rows.map((row) => ({
      account_id: row.accountId,
      tank_id: row.tankId,
      battles: row.battles,
      wins: row.wins,
      mark_of_mastery: row.markOfMastery,
      last_battle_at: row.lastBattleAt
    }))
  )}::jsonb)
    AS r(account_id bigint, tank_id int, battles int, wins int, mark_of_mastery smallint, last_battle_at timestamptz)
  ON CONFLICT (account_id, tank_id) DO UPDATE SET
    battles = EXCLUDED.battles,
    wins = EXCLUDED.wins,
    mark_of_mastery = EXCLUDED.mark_of_mastery,
    last_battle_at = coalesce(EXCLUDED.last_battle_at, player_tank.last_battle_at),
    updated_at = now()
  WHERE player_tank.battles <= EXCLUDED.battles
`;

export const updateMarksSql = (rows: readonly MarksRow[]): Prisma.Sql => Prisma.sql`
  UPDATE player_tank p
  SET marks_on_gun = r.marks, updated_at = now()
  FROM jsonb_to_recordset(${toJson(rows.map((row) => ({ account_id: row.accountId, tank_id: row.tankId, marks: row.marks })))}::jsonb)
    AS r(account_id bigint, tank_id int, marks smallint)
  WHERE p.account_id = r.account_id AND p.tank_id = r.tank_id
`;

export const upsertLatestTanksSql = ({ accountId, capturedAt }: LatestTanksSqlInput): Prisma.Sql => Prisma.sql`
  INSERT INTO tank_snapshot_latest (${columns})
  SELECT ${columns} FROM tank_snapshot
  WHERE account_id = ${accountId} AND captured_at = ${capturedAt}
  ON CONFLICT (account_id, tank_id, mode) DO UPDATE SET ${updates}
  WHERE tank_snapshot_latest.captured_at < EXCLUDED.captured_at
`;

export const markSyncedSql = (rows: readonly SyncedRow[]): Prisma.Sql => Prisma.sql`
  UPDATE player p
  SET last_battle_at = r.last_battle_at, last_polled_at = r.last_polled_at, next_poll_at = r.next_poll_at, updated_at = now()
  FROM jsonb_to_recordset(${toJson(
    rows.map((row) => ({
      account_id: row.accountId,
      last_battle_at: row.lastBattleAt,
      last_polled_at: row.lastPolledAt,
      next_poll_at: row.nextPollAt
    }))
  )}::jsonb)
    AS r(account_id bigint, last_battle_at timestamptz, last_polled_at timestamptz, next_poll_at timestamptz)
  WHERE p.account_id = r.account_id
`;
