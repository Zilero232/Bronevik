import type { MissionNode } from '../../../../../lib/mission-nodes';

export type MissionNodeProps = {
  node: MissionNode;
  isSelected: boolean;
  onSelect: (questId: number) => void;
};
