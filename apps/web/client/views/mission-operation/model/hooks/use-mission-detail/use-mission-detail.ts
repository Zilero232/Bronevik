'use client';

import { missionDetailState } from '../../../lib/mission-detail';
import { useMissionProgress } from '../use-mission-progress';
import { useMissionSelection } from '../use-mission-selection';

export const useMissionDetail = () => {
  const { mission } = useMissionSelection();
  const { isSignedIn, isSaving, progressOf, setProgress } = useMissionProgress();

  if (!mission) {
    return null;
  }

  return {
    mission,
    isSignedIn,
    ...missionDetailState({ mission, progress: progressOf(mission.questId), isSaving, onProgress: setProgress })
  };
};
