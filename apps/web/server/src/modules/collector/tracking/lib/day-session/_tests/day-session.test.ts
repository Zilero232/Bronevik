import type { ExpectedValuesTable } from '@otmetki/ratings';

import { accountWn8 } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import type { DaySessionDelta } from '../day-session.types';

import { buildDaySession } from '../day-session';

const day = new Date('2026-09-24T00:00:00.000Z');

const delta = (tankId: number, capturedAt: string, battles: number): DaySessionDelta => ({
  tankId,
  capturedAt: new Date(capturedAt),
  battles,
  wins: battles - 1,
  damageDealt: battles * 2_000,
  damageBlocked: battles * 500,
  frags: battles,
  spotted: battles * 2,
  xp: battles * 900,
  survived: 1,
  capturePoints: 0,
  droppedCapturePoints: battles
});

const expected: ExpectedValuesTable = new Map([[1, { tankId: 1, expDamage: 1_500, expSpot: 1, expFrag: 1, expDef: 0.5, expWinRate: 50 }]]);
const deltas = [delta(1, '2026-09-24T18:00:00Z', 3), delta(2, '2026-09-24T09:00:00Z', 2), delta(1, '2026-09-24T12:00:00Z', 1)];

describe('buildDaySession', () => {
  it('returns nothing for a day without battles', () => {
    expect(buildDaySession({ accountId: 1n, day, deltas: [], expected })).toBeNull();
  });

  it('sums every delta of the day into one api day session', () => {
    const session = buildDaySession({ accountId: 1n, day, deltas, expected });

    expect(session).toMatchObject({ accountId: 1n, source: 'api', kind: 'day', day });
    expect(session?.battles).toBe(deltas.reduce((sum, row) => sum + row.battles, 0));
    expect(session?.damageDealt).toBe(deltas.reduce((sum, row) => sum + row.damageDealt, 0));
    expect(session?.spotted).toBe(deltas.reduce((sum, row) => sum + row.spotted, 0));
  });

  it('spans the first to the last capture of the day', () => {
    const session = buildDaySession({ accountId: 1n, day, deltas, expected });

    expect(session?.startedAt).toEqual(new Date('2026-09-24T09:00:00Z'));
    expect(session?.lastActivityAt).toEqual(new Date('2026-09-24T18:00:00Z'));
  });

  it('rates the day with per-tank WN8 over the tanks that have expected values', () => {
    const tank = deltas.filter((row) => row.tankId === 1);
    const tanks = [
      {
        tankId: 1,
        battles: 4,
        wins: tank.reduce((sum, row) => sum + row.wins, 0),
        damageDealt: 8_000,
        frags: 4,
        spotted: 8,
        capturePoints: 0,
        droppedCapturePoints: 4
      }
    ];

    expect(buildDaySession({ accountId: 1n, day, deltas, expected })?.wn8).toBe(accountWn8({ tanks, expected }).wn8);
  });

  it('leaves WN8 empty when no tank has expected values', () => {
    expect(buildDaySession({ accountId: 1n, day, deltas, expected: new Map() })?.wn8).toBeNull();
  });
});
