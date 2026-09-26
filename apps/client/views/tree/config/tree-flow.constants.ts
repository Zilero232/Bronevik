import { BranchEdge } from '../ui/components/BranchEdge';
import { TankNode } from '../ui/components/TankNode';

export const TREE_FLOW_TYPES = {
  nodes: { tank: TankNode },
  edges: { branch: BranchEdge }
} as const;
