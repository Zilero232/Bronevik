import type { Mission, MissionProgressItem } from '@otmetki/schemas';

export type MissionRowProps = {
  mission: Mission;
  progress: MissionProgressItem | null;
  isSelected: boolean;
  onSelect: (questId: number) => void;
};
