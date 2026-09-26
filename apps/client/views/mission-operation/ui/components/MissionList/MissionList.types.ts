import type { Mission, MissionProgressItem } from '@otmetki/schemas';

export type MissionListProps = {
  missions: Mission[];
  selectedId: number | null;
  progressOf: (questId: number) => MissionProgressItem | null;
  onSelect: (questId: number) => void;
};
