import type { TechTree, TechTreeNode } from '@otmetki/schemas';

export type TreeSplit = {
  tree: TechTree;
  premiums: TechTreeNode[];
};
