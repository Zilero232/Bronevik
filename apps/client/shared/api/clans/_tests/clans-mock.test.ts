import { clanEventsPageSchema, clanListPageSchema, clanListSortFieldSchema, clanPageSchema, clanStrongholdSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_CLANS } from '@/shared/mocks';

import { mockClanEvents, mockClanList, mockClanPage, mockClanStronghold } from '../clans.mock';

describe('clans mocks', () => {
  it('answer every clan endpoint in the shape the API contract promises', () => {
    MOCK_CLANS.forEach(({ id, tag }) => {
      expect(() => clanPageSchema.parse(mockClanPage(tag))).not.toThrow();
      expect(() => clanEventsPageSchema.parse(mockClanEvents({ clanId: id }))).not.toThrow();
      expect(() => clanStrongholdSchema.parse(mockClanStronghold(id))).not.toThrow();
    });
  });

  it('answer the clan list in the contract shape for every sort field', () => {
    clanListSortFieldSchema.options.forEach((sort) => {
      expect(() => clanListPageSchema.parse(mockClanList({ sort }))).not.toThrow();
    });
  });

  it('report an unknown clan as missing', () => {
    expect(mockClanPage('nobody')).toBeNull();
    expect(mockClanStronghold(0)).toBeNull();
  });

  it('keep the roster size equal to the member count', () => {
    const page = mockClanPage(MOCK_CLANS[0]?.tag ?? '');

    expect(page?.members).toHaveLength(page?.clan.membersCount ?? -1);
  });

  it('order the clan list by the chosen field in the chosen direction', () => {
    const desc = mockClanList({ sort: 'wn8', order: 'desc' }).items.map(({ avgWn8 }) => avgWn8.value ?? 0);
    const asc = mockClanList({ sort: 'wn8', order: 'asc' }).items.map(({ avgWn8 }) => avgWn8.value ?? 0);

    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    expect(asc).toEqual([...desc].reverse());
  });

  it('keep only clans whose tag or name matches the search', () => {
    const [first] = MOCK_CLANS;
    const { items, total } = mockClanList({ search: first?.tag.toLowerCase() });

    expect(items.map(({ clan }) => clan.tag)).toContain(first?.tag);
    expect(total).toBeLessThanOrEqual(MOCK_CLANS.length);
  });

  it('page the clan list without losing or repeating clans', () => {
    const limit = 2;
    const pages = Array.from({ length: Math.ceil(MOCK_CLANS.length / limit) }, (_, index) => mockClanList({ limit, offset: index * limit }).items);
    const ids = pages.flat().map(({ clan }) => clan.clanId);

    expect(new Set(ids).size).toBe(MOCK_CLANS.length);
  });

  it('sum the stronghold skirmishes into the total', () => {
    MOCK_CLANS.forEach(({ id }) => {
      const stronghold = mockClanStronghold(id);
      const sum = stronghold?.skirmishes.reduce((total, { battles }) => total + battles, 0);

      expect(stronghold?.battles).toBe(sum);
      expect(stronghold?.globalMap.provincesCount).toBe(stronghold?.globalMap.provinces.length);
    });
  });
});
