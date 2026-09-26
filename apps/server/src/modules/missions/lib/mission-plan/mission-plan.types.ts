export type PlanMission = {
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

export type PlannedStep = {
  questId: number;
  chainId: number;
  branchKey: string;
  title: string;
  shortTitle: string | null;
  withHonors: boolean;
};

export type ToStepInput = {
  branch: PlanBranch;
  mission: PlanMission;
  withHonors: boolean;
};
