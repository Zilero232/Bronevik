import type { TechTree } from '@bronevik/schemas';

import type { TreeLayout } from '../../../lib/tree-layout';

export type TreeCanvasProps = {
  tree: TechTree;
  layout: TreeLayout;
  path: number[];
  onSelect: (tankId: number | null) => void;
};
