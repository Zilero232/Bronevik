export type AssignCohortInput = {
  battles: number;
  winRate: number;
  wn8?: number | null;
};

type CohortThresholds = {
  elite: number;
  good: number;
  average: number;
};

export type ByThresholdsInput = {
  value: number;
  thresholds: CohortThresholds;
};
