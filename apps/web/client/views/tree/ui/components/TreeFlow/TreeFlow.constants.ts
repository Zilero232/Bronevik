import { BranchEdge } from '../BranchEdge';
import { TankNode } from '../TankNode';

export const TREE_FLOW_TYPES = {
  nodes: { tank: TankNode },
  edges: { branch: BranchEdge }
} as const;
