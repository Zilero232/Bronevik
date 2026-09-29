import type { CompareCell } from '../../../lib/compare-rows';

export type BoardCell = Omit<CompareCell, 'value'> & {
  display: string;
};

type BoardRow = {
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
