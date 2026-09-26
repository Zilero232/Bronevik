import type { TechTree, TechTreeNode } from '@otmetki/schemas';

import type { TreeLayout } from '../../../lib/tree-layout';

export type TreeWorkspaceProps = {
  tree: TechTree;
  premiums: TechTreeNode[];
  layout: TreeLayout;
};
