import type { DataTableLayout, DataTableLayoutInput, FallbackRowCountInput } from './data-table-layout.types';

export const dataTableLayout = ({ hasCards, isHydrated, isCompact }: DataTableLayoutInput): DataTableLayout => {
  if (!hasCards) {
    return { showTable: true, showCards: false };
  }

  if (!isHydrated) {
    return { showTable: true, showCards: true };
  }

  return { showTable: !isCompact, showCards: isCompact };
};

export const fallbackRowCount = ({ dataLength, isLoading, skeletonRows, virtualizeAfter }: FallbackRowCountInput) =>
  isLoading || dataLength === 0 ? skeletonRows : Math.min(dataLength, virtualizeAfter);
