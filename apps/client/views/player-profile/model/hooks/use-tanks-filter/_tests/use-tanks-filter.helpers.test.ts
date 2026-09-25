import { describe, expect, it } from 'vitest';

import { matchesTankQuery, toggleValue } from '../use-tanks-filter.helpers';

describe('toggleValue', () => {
  it('adds a value that is not selected yet', () => {
    expect(toggleValue({ values: [8, 9], value: 10 })).toEqual([8, 9, 10]);
  });

  it('removes a value that is already selected', () => {
    expect(toggleValue({ values: [8, 9, 10], value: 9 })).toEqual([8, 10]);
  });

  it('leaves the original list untouched', () => {
    const values = [1, 2];

    toggleValue({ values, value: 3 });

    expect(values).toEqual([1, 2]);
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
