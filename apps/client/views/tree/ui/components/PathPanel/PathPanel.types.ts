import type { TechTreeNode } from '@bronevik/schemas';

import type { PathCost } from '../../../lib/tree-path';

export type PathPanelProps = {
  selected: TechTreeNode;
  steps: TechTreeNode[];
  cost: PathCost;
  onClear: () => void;
};
