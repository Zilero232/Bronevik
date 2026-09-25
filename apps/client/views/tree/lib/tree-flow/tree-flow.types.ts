import type { TechTree, TechTreeNode } from '@bronevik/schemas';
import type { Edge, Node } from '@xyflow/react';

import type { TreeLayout } from '../tree-layout';

export type TreeElementState = 'dimmed' | 'idle' | 'path' | 'selected';

export type TankNodeData = {
  node: TechTreeNode;
  state: TreeElementState;
  delay: number;
  onSelect: (tankId: number) => void;
};

export type TankFlowNode = Node<TankNodeData, 'tank'>;

export type BranchEdgeData = {
  xp: number | null;
  state: TreeElementState;
  delay: number;
};

export type BranchFlowEdge = Edge<BranchEdgeData, 'branch'>;

export type TreeFlowInput = {
  tree: TechTree;
  layout: TreeLayout;
  path: number[];
  onSelect: (tankId: number) => void;
};
