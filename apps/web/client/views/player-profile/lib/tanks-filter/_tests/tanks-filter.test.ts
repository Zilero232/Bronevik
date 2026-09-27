import { describe, expect, it } from 'vitest';

import type { TanksFilterState } from '../tanks-filter.types';

import { matchesTankQuery, tanksRequest, tiersOf } from '../tanks-filter';

const EMPTY: TanksFilterState = { tiers: [], types: [], nation: 'all', premium: 'all', query: '' };

describe('tiersOf', () => {
  it('reads chip values back into tiers', () => {
    expect(tiersOf(['8', '10'])).toEqual([8, 10]);
  });

  it('drops values that are not a tier', () => {
    expect(tiersOf(['0', 'x', '12'])).toEqual([]);
  });

  it('returns tiers in ascending order whatever the click order', () => {
    expect(tiersOf(['10', '6'])).toEqual([6, 10]);
  });
});

describe('matchesTankQuery', () => {
  it('matches everything for an empty query', () => {
    expect(matchesTankQuery({ name: 'ИС-7', query: '' })).toBe(true);
  });

  it('ignores case, spaces, dots and dashes', () => {
    expect(matchesTankQuery({ name: 'Объект 140', query: 'объект140' })).toBe(true);
    expect(matchesTankQuery({ name: 'ИС-7', query: 'ис7' })).toBe(true);
  });

  it('rejects a name that does not contain the query', () => {
    expect(matchesTankQuery({ name: 'Kranvagn', query: 'grille' })).toBe(false);
  });
});

describe('tanksRequest', () => {
  it('sends no nation and no premium flag when every option is open', () => {
    expect(tanksRequest(EMPTY)).toEqual({ tiers: [], types: [], nations: [], premium: undefined });
  });

  it('turns the premium switch into a boolean', () => {
    expect(tanksRequest({ ...EMPTY, premium: 'premium' }).premium).toBe(true);
    expect(tanksRequest({ ...EMPTY, premium: 'regular' }).premium).toBe(false);
  });

  it('wraps a single nation into the list the API expects', () => {
    expect(tanksRequest({ ...EMPTY, nation: 'germany' }).nations).toEqual(['germany']);
  });
});
