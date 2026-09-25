import type { AccumulateInput, MapBounds, MergeGridsInput, ToCellInput } from './heatmap.types';

import { arenaBoundsSchema, heatmapDataSchema } from './heatmap.schemas';

export const fallbackBounds = (halfSize: number): MapBounds => ({ minX: -halfSize, maxX: halfSize, minZ: -halfSize, maxZ: halfSize });

export const arenaBounds = (data: unknown): MapBounds | null => {
  const parsed = arenaBoundsSchema.safeParse(data);

  if (!parsed.success) {
    return null;
  }

  const [minX, minZ] = parsed.data.boundingBox.bottomLeft;
  const [maxX, maxZ] = parsed.data.boundingBox.upperRight;

  return maxX > minX && maxZ > minZ ? { minX, maxX, minZ, maxZ } : null;
};

export const toCell = ({ x, z, bounds, gridSize }: ToCellInput): number | null => {
  if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) {
    return null;
  }

  const column = Math.min(gridSize - 1, Math.floor(((x - bounds.minX) / (bounds.maxX - bounds.minX)) * gridSize));
  const row = Math.min(gridSize - 1, Math.floor(((bounds.maxZ - z) / (bounds.maxZ - bounds.minZ)) * gridSize));

  return row * gridSize + column;
};

export const emptyGrid = (gridSize: number): number[] => Array.from<number>({ length: gridSize * gridSize }).fill(0);

export const accumulateTracks = ({ tracks, bounds, gridSize }: AccumulateInput): number[] => {
  const grid = emptyGrid(gridSize);

  for (const track of tracks) {
    for (const [, x, z] of track.points) {
      const cell = toCell({ x, z, bounds, gridSize });

      if (cell !== null) {
        grid[cell] = (grid[cell] ?? 0) + 1;
      }
    }
  }

  return grid;
};

export const mergeGrids = ({ base, add }: MergeGridsInput): number[] => {
  if (!base || base.length !== add.length) {
    return [...add];
  }

  return add.map((value, index) => value + (base[index] ?? 0));
};

export const readHeatmapCells = (data: unknown): number[] | null => {
  const parsed = heatmapDataSchema.safeParse(data);

  return parsed.success ? parsed.data.cells : null;
};

export const gridTotal = (cells: readonly number[]): number => cells.reduce((total, value) => total + value, 0);
