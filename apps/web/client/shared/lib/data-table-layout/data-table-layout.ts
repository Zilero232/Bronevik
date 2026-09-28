import type { DataTableLayout, DataTableLayoutInput } from './data-table-layout.types';

export const dataTableLayout = ({ hasCards, isHydrated, isCompact }: DataTableLayoutInput): DataTableLayout => {
  if (!hasCards) {
    return { showTable: true, showCards: false };
  }

  if (!isHydrated) {
    return { showTable: true, showCards: true };
  }

  return { showTable: !isCompact, showCards: isCompact };
};
