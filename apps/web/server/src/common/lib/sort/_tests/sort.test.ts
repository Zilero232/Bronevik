import { describe, expect, it } from 'vitest';

import { page, sortRows } from '../sort';

type Row = { id: string; score: number | null };

const rows: Row[] = [
  { id: 'a', score: 2 },
  { id: 'b', score: null },
  { id: 'c', score: 3 },
  { id: 'd', score: 1 }
];

const ids = (sorted: Row[]) => sorted.map((row) => row.id);

describe('sortRows', () => {
  it('sorts descending with unknown values last', () => {
    expect(ids(sortRows({ rows, value: (row) => row.score, order: 'desc' }))).toEqual(['c', 'a', 'd', 'b']);
  });

  it('sorts ascending and still keeps unknown values last', () => {
    expect(ids(sortRows({ rows, value: (row) => row.score, order: 'asc' }))).toEqual(['d', 'a', 'c', 'b']);
  });

  it('keeps zero as a real value ahead of unknown ones', () => {
    const withZero: Row[] = [
      { id: 'none', score: null },
      { id: 'zero', score: 0 }
    ];

    expect(ids(sortRows({ rows: withZero, value: (row) => row.score, order: 'desc' }))).toEqual(['zero', 'none']);
  });

  it('keeps the input order of equal values and leaves the input untouched', () => {
    const tied: Row[] = [
      { id: 'x', score: 1 },
      { id: 'y', score: 1 }
    ];

    expect(ids(sortRows({ rows: tied, value: (row) => row.score, order: 'desc' }))).toEqual(['x', 'y']);
    sortRows({ rows, value: (row) => row.score, order: 'desc' });

    expect(ids(rows)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('sorts strings too', () => {
    expect(ids(sortRows({ rows, value: (row) => row.id, order: 'desc' }))).toEqual(['d', 'c', 'b', 'a']);
  });
});

describe('page', () => {
  it('slices the requested window and reports the full total', () => {
    expect(page({ items: rows, limit: 2, offset: 1 })).toEqual({ items: rows.slice(1, 3), total: rows.length, limit: 2, offset: 1 });
  });

  it('returns an empty window past the end', () => {
    expect(page({ items: rows, limit: 2, offset: rows.length }).items).toEqual([]);
  });
});
