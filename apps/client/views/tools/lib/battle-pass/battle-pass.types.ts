export type BattlePassPlanInput = {
  stage: number;
  stagePoints: number;
  pointsPerStage: number;
  stages: number;
  daysLeft: number;
  pointsPerBattle: number;
  battlesPerDay: number;
  today: Date | null;
};

export type BattlePassPlan = {
  total: number;
  earned: number;
  pointsLeft: number;
  progress: number;
  battlesNeeded: number | null;
  battlesPerDayNeeded: number | null;
  daysNeeded: number | null;
  finishDate: Date | null;
  isOnTrack: boolean;
};
