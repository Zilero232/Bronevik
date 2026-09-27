import type { Mission, MissionProgressItem } from '@otmetki/schemas';

export type MissionNodeState = 'available' | 'current' | 'done' | 'honors' | 'locked';

export type MissionNode = {
  mission: Mission;
  state: MissionNodeState;
};

export type MissionNodesInput = {
  missions: readonly Mission[];
  progress: ReadonlyMap<number, MissionProgressItem>;
  isTracked: boolean;
};
