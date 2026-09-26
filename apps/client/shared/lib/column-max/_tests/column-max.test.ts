import { describe, expect, it } from 'vitest';

import { columnMax } from '../column-max';

describe('columnMax', () => {
  it('returns the largest finite value of the column', () => {
    const rows = [{ v: 3 }, { v: 12 }, { v: 7 }];

    expect(columnMax({ rows, value: (row) => row.v })).toBe(Math.max(...rows.map((row) => row.v)));
  });

  it('skips missing and non-finite values', () => {
    const rows = [{ v: null }, { v: Number.NaN }, { v: 4 }, { v: undefined }];

    expect(columnMax({ rows, value: (row) => row.v })).toBe(4);
  });

  it('is zero for an empty or all-negative column so bars stay empty', () => {
    expect(columnMax({ rows: [], value: () => 1 })).toBe(0);
    expect(columnMax({ rows: [{ v: -2 }], value: (row) => row.v })).toBe(0);
  });
});
