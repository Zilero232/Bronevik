import { describe, expect, it } from 'vitest';

import { heatCells, heatLevels } from '../heatmap-scale';

describe('heatLevels', () => {
  it('gives the busiest cell the top level and empty cells level zero', () => {
    expect(heatLevels({ cells: [0, 100], levels: 6 })).toEqual([0, 6]);
  });

  it('keeps a single visit visible next to a hot spot', () => {
    expect(heatLevels({ cells: [1, 10_000], levels: 6 })[0]).toBe(1);
  });

  it('never decreases as traffic grows', () => {
    const levels = heatLevels({ cells: [1, 5, 20, 50, 100], levels: 6 });

    expect(levels).toEqual([...levels].sort((a, b) => a - b));
  });

  it('shows nothing for an empty map', () => {
    expect(heatLevels({ cells: [0, 0, 0], levels: 6 })).toEqual([0, 0, 0]);
  });
});

describe('heatCells', () => {
  it('lays cells out row by row from the top-left corner', () => {
    expect(heatCells({ cells: [0, 0, 0, 4], levels: 2, gridSize: 2 })).toEqual([{ x: 1, y: 1, level: 2 }]);
  });

  it('refuses a grid whose size does not match its cell count', () => {
    expect(heatCells({ cells: [1, 2, 3], levels: 2, gridSize: 2 })).toEqual([]);
  });
});
