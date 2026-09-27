import type { MissionBranch } from '@otmetki/schemas';

import type { MissionNode, MissionNodesInput } from '../mission-nodes';

export type OperationColumn = {
  branch: MissionBranch;
  label: string;
  nodes: MissionNode[];
  done: number;
};

export type OperationColumnsInput = Pick<MissionNodesInput, 'isTracked' | 'progress'> & {
  branches: readonly MissionBranch[];
  label: (key: string) => string;
};

export type OperationTotals = {
  done: number;
  honors: number;
};

export type SelectedNodeInput = {
  columns: readonly OperationColumn[];
  questId: number | null;
};
