import type { MissionDetailInput } from './mission-detail.types';

import { visibleConditions } from '../condition-text';
import { progressToggle } from '../progress-toggle';

export const missionDetailState = ({ mission, progress, isSaving, onProgress }: MissionDetailInput) => {
  const current = { done: progress?.done ?? false, honors: progress?.honors ?? false };
  const { main, honors } = visibleConditions(mission.conditions);

  const toggle = (field: 'done' | 'honors') => (checked: boolean) => {
    if (!isSaving) {
      onProgress({ questId: mission.questId, ...progressToggle({ current, field, checked }) });
    }
  };

  return {
    main,
    honors,
    hasHonors: mission.hasHonors && honors.length > 0,
    done: current.done,
    withHonors: current.honors,
    toggleDone: toggle('done'),
    toggleHonors: toggle('honors')
  };
};
