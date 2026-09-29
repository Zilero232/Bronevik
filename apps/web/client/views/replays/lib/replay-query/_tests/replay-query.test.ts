import { PAGINATION } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { ReplayFilters } from '../replay-query.types';

import { REPLAY_LIST } from '../../../config';
import { fromSelectValue, hasActiveFilters, pageWindow, toSearchQuery, toSelectValue } from '../replay-query';

const EMPTY: ReplayFilters = {
  tank: null,
  map: null,
  mode: null,
  player: '',
  clan: '',
  result: null,
  tiers: [],
  types: [],
  nations: [],
  minDamage: null,
  minAssist: null,
  minBlocked: null,
  minFrags: null,
  mastery: null,
  version: null,
  tags: [],
  sort: 'recent',
  offset: 0
};

describe('toSearchQuery', () => {
  it('sends only the sort and the page when no filter is set', () => {
    expect(toSearchQuery({ filters: EMPTY, limit: 25 })).toEqual({ sort: 'recent', limit: 25, offset: 0 });
  });

  it('maps every URL filter onto its server query field', () => {
    const query = toSearchQuery({
      filters: { ...EMPTY, tank: 1, map: '01_karelia', mode: 'ctf', player: 'Straik', result: 'win', sort: 'damage', offset: 50 },
      limit: 25
    });

    expect(query).toEqual({ sort: 'damage', limit: 25, offset: 50, tankId: 1, arenaId: '01_karelia', mode: 'ctf', player: 'Straik', result: 'win' });
  });

  it('drops a nickname the server would reject instead of failing the whole request', () => {
    expect(toSearchQuery({ filters: { ...EMPTY, player: 'a' }, limit: 25 }).player).toBeUndefined();
    expect(toSearchQuery({ filters: { ...EMPTY, player: 'bad name!' }, limit: 25 }).player).toBeUndefined();
  });

  it('trims a nickname typed with surrounding spaces', () => {
    expect(toSearchQuery({ filters: { ...EMPTY, player: '  Straik ' }, limit: 25 }).player).toBe('Straik');
  });

  it('ignores a map or mode slug hand-edited into something the server rejects', () => {
    const query = toSearchQuery({ filters: { ...EMPTY, map: 'bad slug', mode: '../x' }, limit: 25 });

    expect(query.arenaId).toBeUndefined();
    expect(query.mode).toBeUndefined();
  });

  it('never sends a negative offset or a non-positive tank id', () => {
    const query = toSearchQuery({ filters: { ...EMPTY, offset: -10, tank: 0 }, limit: 25 });

    expect(query.offset).toBe(0);
    expect(query.tankId).toBeUndefined();
  });

  it('clamps an offset from the URL to the deepest one the API accepts', () => {
    expect(toSearchQuery({ filters: { ...EMPTY, offset: PAGINATION.maxOffset * 3 }, limit: 25 }).offset).toBe(PAGINATION.maxOffset);
  });
});

describe('toSearchQuery extended filters', () => {
  it('sends the vehicle, minimum, mastery, version and tag filters', () => {
    const query = toSearchQuery({
      filters: {
        ...EMPTY,
        clan: ' ABC ',
        tiers: [10],
        types: ['heavyTank'],
        nations: ['ussr'],
        minDamage: 5000,
        minFrags: 0,
        mastery: 4,
        version: '2.1.0',
        tags: ['kolobanov']
      },
      limit: 25
    });

    expect(query).toMatchObject({
      clan: 'ABC',
      tiers: [10],
      types: ['heavyTank'],
      nations: ['ussr'],
      minDamage: 5000,
      minFrags: 0,
      mastery: 4,
      version: '2.1.0',
      tags: ['kolobanov']
    });
  });

  it('drops values the server would reject', () => {
    const query = toSearchQuery({ filters: { ...EMPTY, clan: 'TOO_LONG_TAG', mastery: 7, minAssist: -1, version: '  ' }, limit: 25 });

    expect(query.clan).toBeUndefined();
    expect(query.mastery).toBeUndefined();
    expect(query.minAssist).toBeUndefined();
    expect(query.version).toBeUndefined();
  });

  it('sends no empty lists', () => {
    const query = toSearchQuery({ filters: EMPTY, limit: 25 });

    expect(query.tiers).toBeUndefined();
    expect(query.tags).toBeUndefined();
  });
});

describe('hasActiveFilters', () => {
  it('reports every extended filter as active', () => {
    expect(hasActiveFilters({ ...EMPTY, minFrags: 0 })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY, tags: ['warrior'] })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY, clan: 'ABC' })).toBe(true);
  });

  it('treats the sort and the page as not being filters', () => {
    expect(hasActiveFilters({ ...EMPTY, sort: 'xp', offset: 25 })).toBe(false);
  });

  it('treats a whitespace-only nickname as empty', () => {
    expect(hasActiveFilters({ ...EMPTY, player: '   ' })).toBe(false);
  });

  it('reports a set result filter', () => {
    expect(hasActiveFilters({ ...EMPTY, result: 'loss' })).toBe(true);
  });
});

describe('pageWindow', () => {
  it('has no neighbours when everything fits on one page', () => {
    expect(pageWindow({ offset: 0, limit: 25, total: 10 })).toEqual({ page: 1, pages: 1, prevOffset: null, nextOffset: null });
  });

  it('shows one page for an empty result', () => {
    expect(pageWindow({ offset: 0, limit: 25, total: 0 }).pages).toBe(1);
  });

  it('stops at the last page exactly on the boundary', () => {
    const window = pageWindow({ offset: 25, limit: 25, total: 50 });

    expect(window.page).toBe(2);
    expect(window.nextOffset).toBeNull();
    expect(window.prevOffset).toBe(0);
  });

  it('clamps an offset past the end to the last page', () => {
    expect(pageWindow({ offset: 500, limit: 25, total: 60 }).page).toBe(3);
  });
});

describe('select values', () => {
  it('round-trips an unset filter through the "any" option', () => {
    expect(fromSelectValue(toSelectValue(null))).toBeNull();
    expect(toSelectValue(null)).toBe(REPLAY_LIST.anyValue);
  });

  it('keeps a real value unchanged', () => {
    expect(fromSelectValue(toSelectValue('ctf'))).toBe('ctf');
  });
});
