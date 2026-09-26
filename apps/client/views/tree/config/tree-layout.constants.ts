export const TREE_LAYOUT = {
  nodeWidth: 188,
  nodeHeight: 72,
  columnGap: 72,
  rowGap: 16,
  rulerOffset: 40,
  skeletonColumns: 10
} as const;

export const TREE_VIEW = {
  minZoom: 0.2,
  maxZoom: 1.6,
  fitPadding: 0.14,
  fitMinZoom: 0.55,
  fitDuration: 200,
  compactQuery: '(width <= 1100px)'
} as const;

export const TREE_FORMAT = {
  compact: { notation: 'compact', maximumFractionDigits: 1 }
} as const satisfies Record<string, Intl.NumberFormatOptions>;
