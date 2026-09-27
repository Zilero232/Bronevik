import type { Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type DataTableCardsProps<T> = {
  rows: Row<T>[];
  renderCard: (row: T) => ReactNode;
};
