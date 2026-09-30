export type FallbackRowCountInput = {
  dataLength: number;
  isLoading: boolean;
  skeletonRows: number;
  virtualizeAfter: number;
};

export type DataTableLayoutInput = {
  hasCards: boolean;
  isHydrated: boolean;
  isCompact: boolean;
};

export type DataTableLayout = {
  showTable: boolean;
  showCards: boolean;
};
