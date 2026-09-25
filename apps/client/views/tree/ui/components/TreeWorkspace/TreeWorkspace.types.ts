import type { TechTree, TechTreeNode } from '@bronevik/schemas';

import type { TreeLayout } from '../../../lib/tree-layout';

export type TreeWorkspaceProps = {
  tree: TechTree;
  premiums: TechTreeNode[];
  layout: TreeLayout;
};
