import { describe, expect, it } from 'vitest';

import { pinnedFirst } from '@/shared/lib';

const ROWS = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

const ids = (rows: { id: string }[]) => rows.map(({ id }) => id);

describe('pinnedFirst', () => {
  it('keeps the order when nothing is pinned', () => {
    expect(ids(pinnedFirst({ rows: ROWS, pinnedIds: undefined }))).toEqual(['a', 'b', 'c', 'd']);
  });

  it('lifts pinned rows to the top in their sorted order', () => {
    expect(ids(pinnedFirst({ rows: ROWS, pinnedIds: ['d', 'b'] }))).toEqual(['b', 'd', 'a', 'c']);
  });

  it('ignores pins for rows that are not on screen', () => {
    expect(ids(pinnedFirst({ rows: ROWS, pinnedIds: ['z'] }))).toEqual(['a', 'b', 'c', 'd']);
  });
});
