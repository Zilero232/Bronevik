import type { MoeRow } from '@otmetki/schemas';

export type MarksTableProps = {
  rows: MoeRow[];
  isLoading: boolean;
  isStale: boolean;
  onSelect: (row: MoeRow) => void;
};
