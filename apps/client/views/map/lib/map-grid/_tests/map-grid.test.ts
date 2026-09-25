import { describe, expect, it } from 'vitest';

import { MAP_GRID } from '../../../config';
import { squareAt, squareLabel, squareMeters } from '../map-grid';

describe('squareAt', () => {
  it('names the top-left square with the first letter and the first digit', () => {
    expect(squareAt({ x: 0, y: 0 }).label).toBe(`${MAP_GRID.rows[0]}${MAP_GRID.columns[0]}`);
  });

  it('names the bottom-right square with the last letter and the last digit', () => {
    expect(squareAt({ x: 0.999, y: 0.999 }).label).toBe(`${MAP_GRID.rows.at(-1)}${MAP_GRID.columns.at(-1)}`);
  });

  it('keeps the very edge of the map inside the last square', () => {
    expect(squareAt({ x: 1, y: 1 })).toEqual(squareAt({ x: 0.999, y: 0.999 }));
  });

  it('clamps a pointer that slipped outside the map', () => {
    expect(squareAt({ x: -0.2, y: 1.4 })).toMatchObject({ row: MAP_GRID.rows.length - 1, column: 0 });
  });

  it('reads letters top to bottom and digits left to right', () => {
    expect(squareAt({ x: 0.45, y: 0.15 })).toMatchObject({ row: 1, column: 4 });
  });
});

describe('squareLabel', () => {
  it('skips the letter I like the in-game minimap', () => {
    const labels = MAP_GRID.rows.map((_, row) => squareLabel({ row, column: 0 }));

    expect(labels.some((label) => label.startsWith('I'))).toBe(false);
  });

  it('gives every square of the grid a unique name', () => {
    const labels = MAP_GRID.rows.flatMap((_, row) => MAP_GRID.columns.map((__, column) => squareLabel({ row, column })));

    expect(new Set(labels).size).toBe(MAP_GRID.rows.length * MAP_GRID.columns.length);
  });
});

describe('squareMeters', () => {
  it('splits the map side evenly between the squares', () => {
    expect(squareMeters(1_000) * MAP_GRID.rows.length).toBe(1_000);
  });
});
