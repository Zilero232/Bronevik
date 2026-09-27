import type { TechTreeEdge, TechTreeNode } from '@otmetki/schemas';

export type LayoutTreeInput = {
  nodes: TechTreeNode[];
  edges: TechTreeEdge[];
};

export type NodePosition = {
  x: number;
  y: number;
};

export type TreeLayout = {
  positions: Map<number, NodePosition>;
  tiers: number[];
  width: number;
  height: number;
};
