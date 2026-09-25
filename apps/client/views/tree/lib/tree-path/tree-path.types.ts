import type { TechTreeEdge, TechTreeNode } from '@bronevik/schemas';

export type PathToInput = {
  nodes: TechTreeNode[];
  edges: TechTreeEdge[];
  targetId: number;
};

export type PathCostInput = {
  nodes: TechTreeNode[];
  path: number[];
};

export type PathCost = {
  xp: number;
  credits: number;
  steps: number;
};

export type PathRoute = {
  ids: number[];
  cost: number;
};
