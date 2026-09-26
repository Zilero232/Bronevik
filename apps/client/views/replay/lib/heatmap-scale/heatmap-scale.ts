import type { HeatCell, HeatCellsInput, HeatLevelsInput } from './heatmap-scale.types';

export const heatLevels = ({ cells, levels }: HeatLevelsInput): number[] => {
  const max = Math.max(0, ...cells);

  if (max <= 0 || levels <= 0) {
    return cells.map(() => 0);
  }

  return cells.map((value) => (value <= 0 ? 0 : Math.max(1, Math.ceil(Math.sqrt(value / max) * levels))));
};

export const heatCells = ({ cells, levels, gridSize }: HeatCellsInput): HeatCell[] => {
  if (gridSize <= 0 || cells.length !== gridSize * gridSize) {
    return [];
  }

  return heatLevels({ cells, levels }).flatMap((level, index) =>
    level === 0 ? [] : [{ x: index % gridSize, y: Math.floor(index / gridSize), level }]
  );
};
