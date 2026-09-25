import { describe, expect, it } from 'vitest';

import type { TopFilterState } from '../top-filter.types';

import { TOP_METRICS } from '../../../config';
import { metricFor, toLeaderboardFilter } from '../top-filter';

const STATE: TopFilterState = { scope: 'players', metric: 'eff', period: '30d', tier: 'all', type: 'all', tank: null };

describe('metricFor', () => {
  it('keeps a metric the scope supports', () => {
    expect(metricFor({ scope: 'players', metric: 'eff' })).toBe('eff');
  });

  it('falls back to the first metric of the scope when the current one is not offered', () => {
    expect(metricFor({ scope: 'clans', metric: 'eff' })).toBe(TOP_METRICS.clans[0]);
  });
});

describe('toLeaderboardFilter', () => {
  it('omits the tier and type while they are set to all', () => {
    const filter = toLeaderboardFilter(STATE);

    expect(filter.tier).toBeUndefined();
    expect(filter.type).toBeUndefined();
  });

  it('passes a picked tier as a number', () => {
    expect(toLeaderboardFilter({ ...STATE, tier: '10' }).tier).toBe(10);
  });

  it('sends the tank only for scopes that rank players on a tank', () => {
    const tank = { tankId: 7_169, name: 'ИС-7', nation: 'ussr', type: 'heavyTank', tier: 10 } as const;

    expect(toLeaderboardFilter({ ...STATE, tank }).tankId).toBe(tank.tankId);
    expect(toLeaderboardFilter({ ...STATE, scope: 'clans', tank }).tankId).toBeUndefined();
  });
});
