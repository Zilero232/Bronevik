import type { OperationColumn } from '../../../model/hooks';

export type BranchBoardProps = {
  columns: readonly OperationColumn[];
  selectedId: number | null;
  isTracked: boolean;
  onSelect: (questId: number) => void;
};
