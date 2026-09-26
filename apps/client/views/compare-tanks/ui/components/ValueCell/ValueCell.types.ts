import type { BoardCell } from '../../../model/hooks';

export type ValueCellProps = {
  cell: BoardCell | undefined;
  isLoading: boolean;
};
