import type { Mission, MissionProgressItem, UpdateMissionProgressInput } from '@otmetki/schemas';

export type MissionDetailInput = {
  mission: Mission;
  progress: MissionProgressItem | null;
  isSaving: boolean;
  onProgress: (input: UpdateMissionProgressInput) => void;
};
