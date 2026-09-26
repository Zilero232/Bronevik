export type BoardGridInput = {
  size: number;
  rows: readonly string[];
};

export type BoardGridLabel = {
  label: string;
  offset: number;
};

export type BoardGrid = {
  step: number;
  lines: number[];
  rowLabels: BoardGridLabel[];
  columnLabels: BoardGridLabel[];
};
