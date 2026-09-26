import type { MoeRow } from '@bronevik/schemas';

export type MarksTableProps = {
  rows: MoeRow[];
  isLoading: boolean;
  isStale: boolean;
  onSelect: (row: MoeRow) => void;
};
