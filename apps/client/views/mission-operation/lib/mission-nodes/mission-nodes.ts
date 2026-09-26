import type { Mission } from '@otmetki/schemas';

import { sortBy } from 'remeda';
import { match } from 'ts-pattern';

import type { MissionNode, MissionNodesInput, MissionNodeState } from './mission-nodes.types';

export const missionNodes = ({ missions, progress, isTracked }: MissionNodesInput): MissionNode[] => {
  const ordered = sortBy([...missions], (mission) => mission.position);

  if (!isTracked) {
    return ordered.map((mission) => ({ mission, state: 'available' }));
  }

  const isDone = (questId: number) => progress.get(questId)?.done === true;
  const isUnlocked = (mission: Mission) => mission.isInitial || mission.requiredUnlocks.every(isDone);
  const current = ordered.find((mission) => !isDone(mission.questId) && isUnlocked(mission)) ?? null;

  return ordered.map((mission) => ({
    mission,
    state: match({ item: progress.get(mission.questId), isCurrent: mission.questId === current?.questId })
      .returnType<MissionNodeState>()
      .with({ item: { done: true, honors: true } }, () => 'honors')
      .with({ item: { done: true } }, () => 'done')
      .with({ isCurrent: true }, () => 'current')
      .otherwise(() => (isUnlocked(mission) ? 'available' : 'locked'))
  }));
};

export const doneCount = (nodes: readonly MissionNode[]): number => nodes.filter((node) => node.state === 'done' || node.state === 'honors').length;
