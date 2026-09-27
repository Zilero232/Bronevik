export type HeatLevelsInput = {
  cells: readonly number[];
  levels: number;
};

export type HeatCellsInput = HeatLevelsInput & {
  gridSize: number;
};

export type HeatCell = {
  x: number;
  y: number;
  level: number;
};
