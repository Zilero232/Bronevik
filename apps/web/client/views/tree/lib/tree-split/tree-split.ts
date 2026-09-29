import type { TechTree, TechTreeNode } from '@otmetki/schemas';

import { sortBy } from 'remeda';

import type { TreeSplit } from './tree-split.types';

const isLinked = ({ parents, children }: TechTreeNode) => parents.length > 0 || children.length > 0;

const isShopVehicle = ({ vehicle }: TechTreeNode) => vehicle.isPremium || vehicle.isCollectible;

export const splitTree = (tree: TechTree): TreeSplit => ({
  tree: { ...tree, nodes: tree.nodes.filter(isLinked) },
  premiums: sortBy(
    tree.nodes.filter((node) => !isLinked(node) && isShopVehicle(node)),
    [({ vehicle }) => vehicle.tier, 'desc']
  )
});
