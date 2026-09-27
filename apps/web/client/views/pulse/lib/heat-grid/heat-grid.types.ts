export type HeatCell = {
  hour: number;
  value: number;
  level: number;
};

export type HeatRow = {
  day: number;
  cells: HeatCell[];
};

export type HeatGrid = {
  max: number;
  total: number;
  rows: HeatRow[];
};

export type HeatGridInput = {
  grid: readonly (readonly number[])[];
  levels: number;
};
