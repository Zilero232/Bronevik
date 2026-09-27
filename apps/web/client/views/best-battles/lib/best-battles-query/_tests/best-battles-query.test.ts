import { describe, expect, it } from 'vitest';

import type { BestBattlesState } from '../best-battles-query.types';

import { BEST_BATTLES_VIEW } from '../../../config';
import { hasBattleFilters, toBestBattlesQuery } from '../best-battles-query';

const base: BestBattlesState = { period: 'week', metric: 'damage', tank: null, map: null, medal: null };

describe('toBestBattlesQuery', () => {
  it('sends only the filters that are set', () => {
    expect(toBestBattlesQuery(base)).toEqual({ period: 'week', metric: 'damage', limit: BEST_BATTLES_VIEW.pageSize });
  });

  it('maps the URL names onto the API names', () => {
    const query = toBestBattlesQuery({ ...base, tank: 1, map: 'karelia', medal: 'warrior' });

    expect(query).toMatchObject({ tankId: 1, arenaId: 'karelia', medal: 'warrior' });
  });
});

describe('hasBattleFilters', () => {
  it('ignores the period and the metric', () => {
    expect(hasBattleFilters({ ...base, period: 'month', metric: 'xp' })).toBe(false);
  });

  it('counts any narrowing filter', () => {
    expect(hasBattleFilters({ ...base, medal: 'warrior' })).toBe(true);
  });
});
