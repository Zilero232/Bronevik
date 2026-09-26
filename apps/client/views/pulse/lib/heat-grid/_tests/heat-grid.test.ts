import { describe, expect, it } from 'vitest';

import { heatGrid } from '../heat-grid';

const levels = 5;

describe('heatGrid', () => {
  it('gives the busiest hour the top level and an idle hour level zero', () => {
    const grid = heatGrid({ grid: [[0, 10, 40]], levels });

    expect(grid.rows[0]?.cells.map((cell) => cell.level)).toEqual([0, 1, 4]);
    expect(grid.max).toBe(40);
    expect(grid.total).toBe(50);
  });

  it('keeps the day and hour of every cell', () => {
    const grid = heatGrid({ grid: [[1], [2, 3]], levels });

    expect(grid.rows[1]).toEqual({
      day: 1,
      cells: [
        { hour: 0, value: 2, level: 3 },
        { hour: 1, value: 3, level: 4 }
      ]
    });
  });

  it('leaves an empty week all at level zero', () => {
    const grid = heatGrid({ grid: [[0, 0], [0]], levels });

    expect(grid.max).toBe(0);
    expect(grid.rows.flatMap((row) => row.cells.map((cell) => cell.level))).toEqual([0, 0, 0]);
  });
});
