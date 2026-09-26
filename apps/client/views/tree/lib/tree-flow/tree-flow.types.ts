import type { TechTree, TechTreeNode } from '@bronevik/schemas';
import type { Edge, Node } from '@xyflow/react';

import type { TreeLayout } from '../tree-layout';

export type TreeElementState = 'dimmed' | 'idle' | 'path' | 'selected';

export type NodeStateInput = {
  id: number;
  path: number[];
};

export type TankNodeData = {
  node: TechTreeNode;
  state: TreeElementState;
  onSelect: (tankId: number) => void;
};

export type TankFlowNode = Node<TankNodeData, 'tank'>;

export type BranchEdgeData = {
  xp: number | null;
  state: TreeElementState;
};

export type BranchFlowEdge = Edge<BranchEdgeData, 'branch'>;

export type TreeFlowInput = {
  tree: TechTree;
  layout: TreeLayout;
  path: number[];
  onSelect: (tankId: number) => void;
};
