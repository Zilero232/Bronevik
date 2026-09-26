import type { MissionBranch } from '@otmetki/schemas';

import type { MissionNode } from '../../../lib/mission-nodes';

export type OperationColumn = {
  branch: MissionBranch;
  label: string;
  nodes: MissionNode[];
  done: number;
};
