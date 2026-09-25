import type { BoardCell } from '../../../model/hooks';

export type ValueCellProps = {
  cell: BoardCell | undefined;
  label: string;
  unit: string;
  isLoading: boolean;
};
