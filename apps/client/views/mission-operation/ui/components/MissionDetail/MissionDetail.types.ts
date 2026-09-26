import type { Mission, MissionProgressItem, UpdateMissionProgressInput } from '@otmetki/schemas';

export type MissionDetailProps = {
  mission: Mission;
  progress: MissionProgressItem | null;
  isSignedIn: boolean;
  isSaving: boolean;
  onProgress: (input: UpdateMissionProgressInput) => void;
};
