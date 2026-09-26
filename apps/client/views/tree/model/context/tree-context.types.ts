import type { TechTree, TechTreeNode } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import type { TreeLayout } from '../../lib/tree-layout';

export type TreeContextValue = {
  tree: TechTree;
  layout: TreeLayout;
  premiums: TechTreeNode[];
};

export type TreeProviderProps = TreeContextValue & {
  children: ReactNode;
};
