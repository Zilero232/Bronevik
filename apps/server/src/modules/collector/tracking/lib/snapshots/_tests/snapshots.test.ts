import { describe, expect, it } from 'vitest';

import type { BattleStatsBlock } from '../../../../../../lib/lesta';

import { Prisma } from '../../../../../../../generated';
import { accountSnapshotRow, buildTankDelta, modeBlocks, shouldWriteSnapshot, tankSnapshotRow } from '../snapshots';

const block = (battles: number, blocked = 200): BattleStatsBlock => ({
  battles,
  wins: battles / 2,
  losses: battles / 2,
  draws: 0,
  xp: battles * 700,
  damage_dealt: battles * 1500,
  damage_received: battles * 900,
  frags: battles,
  spotted: battles,
  capture_points: 0,
  dropped_capture_points: battles,
  hits: battles * 5,
  shots: battles * 7,
  survived_battles: battles / 2,
  avg_damage_blocked: blocked
});

const earlier = new Date('2026-09-23T12:00:00Z');
const now = new Date('2026-09-24T12:00:00Z');

type RowInput = {
  battles: number;
  capturedAt: Date;
  blocked?: number;
};

const row = ({ battles, capturedAt, blocked }: RowInput) =>
  tankSnapshotRow({ accountId: 1n, capturedAt, mode: 'random', block: block(battles, blocked), stats: { tank_id: 5, mark_of_mastery: 2 } });

describe('shouldWriteSnapshot', () => {
  it('writes the first snapshot and every battle-count change, nothing else', () => {
    expect(shouldWriteSnapshot({ previous: undefined, battles: 0 })).toBe(true);
    expect(shouldWriteSnapshot({ previous: { battles: 10 }, battles: 10 })).toBe(false);
    expect(shouldWriteSnapshot({ previous: { battles: 10 }, battles: 11 })).toBe(true);
  });

  it('never writes a stale read that is behind the stored snapshot', () => {
    expect(shouldWriteSnapshot({ previous: { battles: 10 }, battles: 9 })).toBe(false);
  });
});

describe('modeBlocks', () => {
  it('skips the random block when Lesta did not return it', () => {
    expect(modeBlocks({ all: block(1) }).map((entry) => entry.mode)).toEqual(['all']);
    expect(modeBlocks({ all: block(1), random: block(1) }).map((entry) => entry.mode)).toEqual(['all', 'random']);
  });
});

describe('accountSnapshotRow', () => {
  it('stores the large counters as bigint', () => {
    const snapshot = accountSnapshotRow({ accountId: 1n, capturedAt: now, mode: 'all', block: block(10), globalRating: 1 });

    expect(snapshot.damageDealt).toBe(15_000n);
    expect(snapshot.xp).toBe(7000n);
  });
});

describe('buildTankDelta', () => {
  const previous = row({ battles: 10, capturedAt: earlier, blocked: 200 });

  it('returns the difference between two cumulative snapshots', () => {
    const delta = buildTankDelta({
      previous,
      current: row({ battles: 14, capturedAt: now, blocked: 250 }),
      cohort: 'good',
      accountWinRate: 53
    });

    expect(delta?.battles).toBe(4);
    expect(delta?.damageDealt).toBe(4 * 1500);
    expect(delta?.damageBlocked).toBe(14 * 250 - 10 * 200);
    expect(delta?.capturedAt).toEqual(now);
  });

  it('has nothing to report without a previous snapshot', () => {
    expect(buildTankDelta({ previous: undefined, current: previous, cohort: 'good', accountWinRate: 50 })).toBeNull();
  });

  it('ignores a snapshot whose battle count did not grow', () => {
    expect(buildTankDelta({ previous, current: row({ battles: 10, capturedAt: now }), cohort: 'good', accountWinRate: 50 })).toBeNull();
  });
});

describe('snapshot rows', () => {
  const columnsOf = (fields: Record<string, string>) => new Set(Object.values(fields));
  const unknownKeys = (row: object, fields: Record<string, string>) => Object.keys(row).filter((key) => !columnsOf(fields).has(key));

  it('write only the columns their tables keep', () => {
    const current = row({ battles: 14, capturedAt: now });
    const delta = buildTankDelta({ previous: row({ battles: 10, capturedAt: earlier }), current, cohort: 'good', accountWinRate: 50 });
    const account = accountSnapshotRow({ accountId: 1n, capturedAt: now, mode: 'all', block: block(10), globalRating: 1 });

    expect(unknownKeys(account, Prisma.AccountSnapshotScalarFieldEnum)).toEqual([]);
    expect(unknownKeys(current, Prisma.TankSnapshotScalarFieldEnum)).toEqual([]);
    expect(unknownKeys(delta ?? {}, Prisma.TankBattleDeltaScalarFieldEnum)).toEqual([]);
  });
});
