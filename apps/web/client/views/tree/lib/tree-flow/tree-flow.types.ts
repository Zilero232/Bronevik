import type { TechTree, TechTreeNode } from '@otmetki/schemas';
import type { Edge, Node } from '@xyflow/react';

import type { TreeLayout } from '../tree-layout';

export type TreeElementState = 'dimmed' | 'idle' | 'path' | 'selected';

export type NodeStateInput = {
  id: number;
  path: number[];
};

type TankNodeData = {
  node: TechTreeNode;
  state: TreeElementState;
};

export type TankFlowNode = Node<TankNodeData, 'tank'>;

type BranchEdgeData = {
  xp: number | null;
  state: TreeElementState;
};

export type BranchFlowEdge = Edge<BranchEdgeData, 'branch'>;

export type TreeFlowInput = {
  tree: TechTree;
  layout: TreeLayout;
  path: number[];
};
