export type OverflowPlanInput = {
  accessEndedAt: Date;
  now: Date;
};

export type OverflowPlan =
  { kind: 'delete'; deleteAt: Date } | { kind: 'notice'; deleteAt: Date; daysLeft: number } | { kind: 'wait'; deleteAt: Date };

export type StoredReplay = {
  id: string;
  createdAt: Date;
};

export type OverflowReplayIdsInput = {
  replays: readonly StoredReplay[];
  keep: number;
};
