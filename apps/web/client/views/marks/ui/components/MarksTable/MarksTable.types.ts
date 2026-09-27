import type { MoeRow } from '@otmetki/schemas';

import type { DataTableProps } from '@/ui-kit';

export type MarksTableProps = Pick<DataTableProps<MoeRow>, 'isLoading'> & {
  rows: MoeRow[];
  isStale?: boolean;
  onSelect: (row: MoeRow) => void;
};
