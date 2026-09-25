export const TREE_LAYOUT = {
  nodeWidth: 188,
  nodeHeight: 84,
  columnGap: 84,
  rowGap: 22,
  rulerOffset: 48
} as const;

export const TREE_MOTION = {
  tierStep: 0.07,
  nodeDuration: 0.45,
  edgeDuration: 0.7,
  edgeLag: 0.12
} as const;

export const TREE_VIEW = {
  minZoom: 0.2,
  maxZoom: 1.6,
  fitPadding: 0.14,
  fitMinZoom: 0.55,
  compactQuery: '(width <= 1100px)'
} as const;
