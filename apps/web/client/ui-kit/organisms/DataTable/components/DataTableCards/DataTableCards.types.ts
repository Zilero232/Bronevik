import type { Row } from '@tanstack/react-table';

import type { DataTableProps } from '../../DataTable.types';

export type DataTableCardsProps<T> = Required<Pick<DataTableProps<T>, 'renderCard'>> & {
  rows: Row<T>[];
  isLoading: boolean;
};
