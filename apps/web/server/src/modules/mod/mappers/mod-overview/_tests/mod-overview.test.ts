import { modOverviewSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { LatestSessionRow, OverallRatingRow } from '../../../selects';

import { toModOverview } from '../mod-overview';

const rating: OverallRatingRow = {
  battles: 1000,
  winRate: 52.5,
  avgDamage: 1500,
  wn8: 1800,
  eff: 1300,
  broneIndex: null,
  computedAt: new Date('2026-09-27T09:30:00.000Z'),
  player: { nickname: 'Tanker' }
};

const session: LatestSessionRow = {
  kind: 'live',
  source: 'mod',
  status: 'open',
  startedAt: new Date('2026-09-27T17:00:00.000Z'),
  endedAt: null,
  battles: 4,
  wins: 3,
  damageDealt: 8000,
  wn8: 2400,
  broneIndex: null
};

describe('toModOverview', () => {
  it('answers a contract-valid overview for the account', () => {
    const overview = toModOverview({ accountId: 12_345n, rating, session });

    expect(modOverviewSchema.parse(overview)).toEqual(overview);
    expect(overview).toMatchObject({ account_id: 12_345, nickname: 'Tanker', session: { is_live: true, win_rate: 75, avg_damage: 2000 } });
  });

  it('keeps an unknown rating as a null value rather than zero', () => {
    const overview = toModOverview({ accountId: 1n, rating, session: null });

    expect(overview.overall?.brone_index).toEqual({ value: null, tier: null });
    expect(overview.session).toBeNull();
  });

  it('reports no overall block for an account the collector has not rated yet', () => {
    expect(toModOverview({ accountId: 1n, rating: null, session: null })).toEqual({ account_id: 1, nickname: null, overall: null, session: null });
  });

  it('has no win rate or average damage for a rating over zero battles', () => {
    const overall = toModOverview({ accountId: 1n, rating: { ...rating, battles: 0 }, session: null }).overall;

    expect(overall).toMatchObject({ battles: 0, win_rate: null, avg_damage: null });
  });

  it('marks a closed or day session as not live', () => {
    expect(toModOverview({ accountId: 1n, rating: null, session: { ...session, status: 'closed' } }).session?.is_live).toBe(false);
    expect(toModOverview({ accountId: 1n, rating: null, session: { ...session, kind: 'day' } }).session?.is_live).toBe(false);
  });

  it('leaves the session averages empty when the session has no battles', () => {
    expect(toModOverview({ accountId: 1n, rating: null, session: { ...session, battles: 0, wins: 0, damageDealt: 0 } }).session).toMatchObject({
      win_rate: null,
      avg_damage: null
    });
  });
});
