import type { TechTree, TechTreeNode } from '@bronevik/schemas';

export type TreeSplit = {
  tree: TechTree;
  premiums: TechTreeNode[];
};
