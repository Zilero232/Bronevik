import { describe, expect, it } from 'vitest';

import type { ReplayFilters } from '../../../model';

import { replayItem } from '../../../_tests/fixtures';
import { REPLAY_FILTER } from '../../../config';
import { activeFilterCount, clearFilters, DEFAULT_REPLAY_FILTERS, filterReplays, matchesReplay } from '../filter-replays';

const NOW = 1_790_600_000;
const DAY = 86_400;

const ITEMS = [
  replayItem({
    id: 'a',
    time: NOW - 600,
    map: '05_prohorovka',
    map_title: 'Прохоровка',
    tank: 'Т-34',
    vehicle: 'ussr-R04_T-34',
    nation: 'ussr',
    tier: 5,
    result: 'win',
    damage: 2150,
    favourite: true
  }),
  replayItem({
    id: 'b',
    time: NOW - 3 * DAY,
    map: '04_himmelsdorf',
    map_title: 'Химмельсдорф',
    tank: 'Tiger I',
    vehicle: 'germany-G04_PzVI_Tiger_I',
    nation: 'germany',
    tier: 7,
    result: 'loss',
    damage: 3400,
    type: 'ranked',
    favourite: false
  }),
  replayItem({
    id: 'c',
    time: NOW - 40 * DAY,
    map: '02_malinovka',
    map_title: 'Малиновка',
    tank: 'Т-34',
    vehicle: 'ussr-R04_T-34',
    nation: 'ussr',
    tier: 5,
    result: null,
    damage: null,
    favourite: false
  })
];

const ids = (filters: Partial<ReplayFilters>): string[] =>
  filterReplays({ items: ITEMS, filters: { ...DEFAULT_REPLAY_FILTERS, ...filters }, now: NOW }).map((item) => item.id);

describe(filterReplays, () => {
  it('lists the newest first by default', () => {
    expect(ids({})).toEqual(['a', 'b', 'c']);
  });

  it('searches the map, the tank and the file name in any case', () => {
    expect(ids({ query: 'ПРОХОР' })).toEqual(['a']);
    expect(ids({ query: 'т-34' })).toEqual(['a', 'c']);
    expect(ids({ query: '  tiger ' })).toEqual(['b']);
  });

  it('combines the result, map, vehicle, tier, type and favourite filters', () => {
    expect(ids({ result: 'loss' })).toEqual(['b']);
    expect(ids({ map: '02_malinovka' })).toEqual(['c']);
    expect(ids({ vehicle: 'ussr-R04_T-34', tier: 5 })).toEqual(['a', 'c']);
    expect(ids({ type: 'ranked' })).toEqual(['b']);
    expect(ids({ favourites: true })).toEqual(['a']);
    expect(ids({ vehicle: 'ussr-R04_T-34', result: 'loss' })).toEqual([]);
  });

  it.each([
    { nation: 'ussr', expected: ['a', 'c'] },
    { nation: 'germany', expected: ['b'] },
    { nation: 'france', expected: [] }
  ] as const)('keeps only the replays of the $nation nation', ({ nation, expected }) => {
    const filters = { nation };

    const visible = ids(filters);

    expect(visible).toEqual(expected);
  });

  it.each([
    { result: 'win', expected: ['a'] },
    { result: 'loss', expected: ['b'] },
    { result: 'draw', expected: [] }
  ] as const)('keeps only the replays with the $result result', ({ result, expected }) => {
    const filters = { result };

    const visible = ids(filters);

    expect(visible).toEqual(expected);
  });

  it.each([
    { filters: { nation: 'ussr', result: 'win' }, expected: ['a'] },
    { filters: { nation: 'ussr', result: 'loss' }, expected: [] },
    { filters: { nation: 'germany', result: 'loss', type: 'ranked', period: 'week' }, expected: ['b'] },
    { filters: { nation: 'ussr', period: 'week', query: 'т-34' }, expected: ['a'] },
    { filters: { nation: 'ussr', tier: 5, descending: false }, expected: ['c', 'a'] }
  ] as const)('combines the nation and the result with the other filters: $filters', ({ filters, expected }) => {
    const visible = ids(filters);

    expect(visible).toEqual(expected);
  });

  it('keeps a period by the age of the battle', () => {
    expect(ids({ period: 'today' })).toEqual(['a']);
    expect(ids({ period: 'week' })).toEqual(['a', 'b']);
    expect(ids({ period: 'month' })).toEqual(['a', 'b']);
  });

  it('sorts by a stat in both directions and puts unknown values last', () => {
    expect(ids({ sort: 'damage' })).toEqual(['b', 'a', 'c']);
    expect(ids({ sort: 'damage', descending: false })).toEqual(['a', 'b', 'c']);
    expect(ids({ sort: 'time', descending: false })).toEqual(['c', 'b', 'a']);
  });
});

describe(matchesReplay, () => {
  it('treats a period boundary as inside', () => {
    const item = replayItem({ time: NOW - REPLAY_FILTER.periodSeconds.week });
    const filters = { ...DEFAULT_REPLAY_FILTERS, period: 'week' as const };

    expect(matchesReplay({ item, filters, now: NOW })).toBe(true);
    expect(matchesReplay({ item, filters, now: NOW + 1 })).toBe(false);
  });
});

describe(activeFilterCount, () => {
  it('counts what narrows the list but not the order', () => {
    expect(activeFilterCount(DEFAULT_REPLAY_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...DEFAULT_REPLAY_FILTERS, sort: 'xp', descending: false, query: '   ' })).toBe(0);
    expect(activeFilterCount({ ...DEFAULT_REPLAY_FILTERS, tier: 5, favourites: true, period: 'week' })).toBe(3);
  });

  it('counts the nation and the result as two filters', () => {
    const filters = { ...DEFAULT_REPLAY_FILTERS, nation: 'ussr' as const, result: 'win' as const };

    const count = activeFilterCount(filters);

    expect(count).toBe(2);
  });
});

describe(clearFilters, () => {
  it('drops every filter and keeps the order', () => {
    const cleared = clearFilters({ ...DEFAULT_REPLAY_FILTERS, map: 'x', nation: 'ussr', result: 'win', sort: 'xp', descending: false });

    expect(cleared).toEqual({ ...DEFAULT_REPLAY_FILTERS, sort: 'xp', descending: false });
  });
});
