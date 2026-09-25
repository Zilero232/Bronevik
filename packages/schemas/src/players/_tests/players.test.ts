import { describe, expect, it } from 'vitest';

import { PAGINATION } from '../../common/query/query.constants';
import { playerTanksQuerySchema, timeSeriesGranularitySchema, timeSeriesQuerySchema } from '../players.schemas';

describe('player schemas', () => {
  it('fills the tank list query defaults and parses list filters', () => {
    const query = playerTanksQuerySchema.parse({ tiers: '8,10', premium: 'true' });

    expect(query).toMatchObject({ tiers: [8, 10], premium: true, minBattles: 0, order: 'desc', limit: PAGINATION.defaultLimit, offset: 0 });
  });

  it('rejects an unknown sort field', () => {
    expect(playerTanksQuerySchema.safeParse({ sort: 'nope' }).success).toBe(false);
  });

  it('defaults time series to the finest granularity', () => {
    expect(timeSeriesQuerySchema.parse({ metric: 'wn8' }).granularity).toBe(timeSeriesGranularitySchema.options[0]);
  });
});
