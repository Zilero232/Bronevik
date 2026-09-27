import { describe, expect, it } from 'vitest';

import type { GuideFilters } from '../guide-filters.types';

import { hasActiveFilters, pageCount, toGuideListQuery } from '../guide-filters';

const EMPTY: GuideFilters = { kind: null, tank: null, map: null, sort: 'recent', page: 1 };

describe('toGuideListQuery', () => {
  it('starts the first page at offset zero and sends no empty filters', () => {
    expect(toGuideListQuery({ filters: EMPTY, pageSize: 20 })).toEqual({ sort: 'recent', limit: 20, offset: 0 });
  });

  it('turns the page number into an offset', () => {
    expect(toGuideListQuery({ filters: { ...EMPTY, page: 3 }, pageSize: 20 }).offset).toBe(40);
  });

  it('never sends a negative offset for a bad page in the URL', () => {
    expect(toGuideListQuery({ filters: { ...EMPTY, page: 0 }, pageSize: 20 }).offset).toBe(0);
    expect(toGuideListQuery({ filters: { ...EMPTY, page: -4 }, pageSize: 20 }).offset).toBe(0);
  });

  it('maps the tank and map filters to the server field names', () => {
    const query = toGuideListQuery({ filters: { ...EMPTY, kind: 'tank', tank: 1, map: 'malinovka', sort: 'popular' }, pageSize: 10 });

    expect(query).toMatchObject({ kind: 'tank', tankId: 1, arenaId: 'malinovka', sort: 'popular' });
  });

  it('drops an empty map value', () => {
    expect(toGuideListQuery({ filters: { ...EMPTY, map: '' }, pageSize: 10 })).not.toHaveProperty('arenaId');
  });
});

describe('pageCount', () => {
  it('rounds a partial page up', () => {
    expect(pageCount({ total: 41, pageSize: 20 })).toBe(3);
  });

  it('keeps one page for an exact multiple', () => {
    expect(pageCount({ total: 40, pageSize: 20 })).toBe(2);
  });

  it('shows a single page when there is nothing', () => {
    expect(pageCount({ total: 0, pageSize: 20 })).toBe(1);
  });
});

describe('hasActiveFilters', () => {
  it('ignores sort and page', () => {
    expect(hasActiveFilters({ ...EMPTY, sort: 'popular', page: 4 })).toBe(false);
  });

  it('detects a kind, tank or map filter', () => {
    expect(hasActiveFilters({ ...EMPTY, kind: 'general' })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY, tank: 1 })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY, map: 'himmelsdorf' })).toBe(true);
  });
});
