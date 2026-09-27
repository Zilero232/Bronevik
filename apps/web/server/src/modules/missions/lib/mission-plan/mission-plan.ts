import { sortBy } from 'remeda';

import type { PlannedStep, PlanOperationInput, ToStepInput } from './mission-plan.types';

const toStep = ({ branch, mission, withHonors }: ToStepInput): PlannedStep => ({
  questId: mission.questId,
  chainId: branch.chainId,
  branchKey: branch.key,
  title: mission.title,
  shortTitle: mission.shortTitle,
  withHonors
});

export const planOperation = ({ branches, progress, coverage = new Map() }: PlanOperationInput): PlannedStep[] => {
  const lanes = branches.map((branch) => {
    const missions = sortBy([...branch.missions], (mission) => mission.position);

    return {
      branch,
      pending: missions.filter((mission) => !progress.get(mission.questId)?.done),
      retries: missions.filter((mission) => {
        const state = progress.get(mission.questId);

        return mission.hasHonors && state?.done === true && !state.honors;
      })
    };
  });

  const ordered = sortBy(
    lanes,
    (lane) => lane.pending.length === 0,
    (lane) => lane.pending.length,
    [(lane) => coverage.get(lane.branch.chainId) ?? 0, 'desc'],
    (lane) => lane.branch.chainId
  );

  return [
    ...ordered.flatMap((lane) => lane.pending.map((mission) => toStep({ branch: lane.branch, mission, withHonors: mission.hasHonors }))),
    ...ordered.flatMap((lane) => lane.retries.map((mission) => toStep({ branch: lane.branch, mission, withHonors: true })))
  ];
};
