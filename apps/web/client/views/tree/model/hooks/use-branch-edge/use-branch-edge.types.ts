import type { EdgeProps } from '@xyflow/react';

import type { BranchFlowEdge } from '../../../lib/tree-flow';

export type UseBranchEdgeInput = Pick<
  EdgeProps<BranchFlowEdge>,
  'data' | 'sourcePosition' | 'sourceX' | 'sourceY' | 'targetPosition' | 'targetX' | 'targetY'
>;
