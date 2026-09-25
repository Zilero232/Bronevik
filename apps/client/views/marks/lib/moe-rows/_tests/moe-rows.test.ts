import type { MoeRow } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { filterByName, latestUpdate } from '../moe-rows';

const row = (name: string, slug: string, updatedAt: string | null): MoeRow => ({
  vehicle: {
    tankId: slug.length,
    name,
    shortName: name,
    slug,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  moe: null,
  mastery: null,
  trend: { p95Delta7d: null, p95Delta30d: null },
  updatedAt
});

const ROWS = [
  row('ИС-7', 'is-7', '2026-09-20T04:00:00+03:00'),
  row('Объект 277', 'object-277', '2026-09-24T04:00:00+03:00'),
  row('Т-62А', 't-62a', null)
];

describe('filterByName', () => {
  it('returns every row for a blank query', () => {
    expect(filterByName({ rows: ROWS, query: '  ' })).toHaveLength(ROWS.length);
  });

  it('ignores case, spaces and dashes in the tank name', () => {
    expect(filterByName({ rows: ROWS, query: 'ис7' }).map(({ vehicle }) => vehicle.slug)).toEqual(['is-7']);
  });

  it('matches the latin slug as well as the name', () => {
    expect(filterByName({ rows: ROWS, query: 'object' }).map(({ vehicle }) => vehicle.slug)).toEqual(['object-277']);
  });
});

describe('latestUpdate', () => {
  it('picks the most recent update among the rows', () => {
    expect(latestUpdate(ROWS)).toBe(ROWS[1].updatedAt);
  });

  it('has no date when nothing was ever updated', () => {
    expect(latestUpdate([ROWS[2]])).toBeNull();
  });
});
