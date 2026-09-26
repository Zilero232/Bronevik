import type { OperationColumn } from '../../../../../model/hooks';

export type BranchColumnProps = {
  column: OperationColumn;
  selectedId: number | null;
  isTracked: boolean;
  onSelect: (questId: number) => void;
};
