import { describe, expect, it } from 'vitest';

import type { TopFilterState } from '../top-filter.types';

import { TOP_METRICS } from '../../../config';
import { metricFor, toLeaderboardFilter } from '../top-filter';

const STATE: TopFilterState = { scope: 'players', metric: 'eff', period: '30d', tier: null, type: null, tank: null };

describe('metricFor', () => {
  it('keeps a metric the scope supports', () => {
    expect(metricFor({ scope: 'players', metric: 'eff' })).toBe('eff');
  });

  it('falls back to the first metric of the scope when the current one is not offered', () => {
    expect(metricFor({ scope: 'clans', metric: 'eff' })).toBe(TOP_METRICS.clans[0]);
  });
});

describe('toLeaderboardFilter', () => {
  it('omits the tier and type while none is picked', () => {
    const filter = toLeaderboardFilter(STATE);

    expect(filter.tier).toBeUndefined();
    expect(filter.type).toBeUndefined();
  });

  it('passes a picked tier and type', () => {
    const filter = toLeaderboardFilter({ ...STATE, tier: 10, type: 'heavyTank' });

    expect(filter.tier).toBe(10);
    expect(filter.type).toBe('heavyTank');
  });

  it('sends the tank only for scopes that rank players on a tank', () => {
    expect(toLeaderboardFilter({ ...STATE, tank: 7_169 }).tankId).toBe(7_169);
    expect(toLeaderboardFilter({ ...STATE, scope: 'clans', tank: 7_169 }).tankId).toBeUndefined();
  });
});
