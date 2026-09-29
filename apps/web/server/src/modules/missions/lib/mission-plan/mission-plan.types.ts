import type { MissionPlanStep } from '@otmetki/schemas';

type PlanMission = {
  questId: number;
  chainId: number;
  position: number;
  title: string;
  shortTitle: string | null;
  hasHonors: boolean;
};

export type PlanBranch = {
  chainId: number;
  key: string;
  missions: readonly PlanMission[];
};

export type PlanProgress = {
  done: boolean;
  honors: boolean;
};

export type PlanOperationInput = {
  branches: readonly PlanBranch[];
  progress: ReadonlyMap<number, PlanProgress>;
  coverage?: ReadonlyMap<number, number>;
};

export type PlannedStep = Omit<MissionPlanStep, 'tank'>;

export type ToStepInput = {
  branch: PlanBranch;
  mission: PlanMission;
  withHonors: boolean;
};

export type ToPlanBranchesInput = {
  branches: readonly Pick<PlanBranch, 'chainId' | 'key'>[];
  missions: readonly PlanMission[];
};
