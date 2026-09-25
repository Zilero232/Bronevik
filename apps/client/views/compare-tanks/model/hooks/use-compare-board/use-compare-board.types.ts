export type BoardCell = {
  display: string;
  ratio: number | null;
  isBest: boolean;
};

export type BoardRow = {
  key: string;
  label: string;
  unit: string;
  cells: BoardCell[];
};

export type BoardSection = {
  id: string;
  title: string;
  isLoading: boolean;
  rows: BoardRow[];
};
