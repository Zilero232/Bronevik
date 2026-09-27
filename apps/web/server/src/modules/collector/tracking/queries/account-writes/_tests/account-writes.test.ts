import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { Prisma } from '../../../../../../../generated';
import { markSyncedSql, upsertLatestTanksSql, upsertPlayerTanksSql } from '../account-writes';
import { TANK_SNAPSHOT_COLUMNS } from '../account-writes.constants';

const jsonParam = (sql: Prisma.Sql): unknown[] => {
  const text = sql.values.find((value): value is string => typeof value === 'string' && value.startsWith('['));

  return text ? z.array(z.unknown()).parse(JSON.parse(text)) : [];
};

describe('TANK_SNAPSHOT_COLUMNS', () => {
  it('copies every column of tank_snapshot into tank_snapshot_latest', () => {
    const snapshot = Object.keys(Prisma.TankSnapshotScalarFieldEnum);

    expect(TANK_SNAPSHOT_COLUMNS).toHaveLength(snapshot.length);
    expect(Object.keys(Prisma.TankSnapshotLatestScalarFieldEnum)).toEqual(snapshot);
  });
});

describe('upsertPlayerTanksSql', () => {
  it('sends bigint account ids as snake_case JSON records', () => {
    const sql = upsertPlayerTanksSql([{ accountId: 9_007_199_254_740_993n, tankId: 1, battles: 3, wins: 2, markOfMastery: 1 }]);

    expect(jsonParam(sql)).toEqual([{ account_id: '9007199254740993', tank_id: 1, battles: 3, wins: 2, mark_of_mastery: 1 }]);
  });

  it('never lets an older read lower the stored battle count', () => {
    expect(upsertPlayerTanksSql([]).sql).toContain('WHERE player_tank.battles <= EXCLUDED.battles');
  });
});

describe('upsertLatestTanksSql', () => {
  it('only replaces a latest row with a newer snapshot', () => {
    expect(upsertLatestTanksSql({ accountId: 1n, capturedAt: new Date() }).sql).toContain('tank_snapshot_latest.captured_at < EXCLUDED.captured_at');
  });
});

describe('markSyncedSql', () => {
  it('writes one record per account', () => {
    const now = new Date('2026-09-24T12:00:00Z');
    const sql = markSyncedSql([
      { accountId: 1, lastBattleAt: null, lastPolledAt: now, nextPollAt: now },
      { accountId: 2, lastBattleAt: now, lastPolledAt: now, nextPollAt: now }
    ]);

    expect(jsonParam(sql)).toHaveLength(2);
  });
});
