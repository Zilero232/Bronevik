export type LearningCurveRow = {
  bucket: number;
  battles: number;
  players: number;
  wins: number;
  damage: bigint;
  windowDays: number;
  computedAt: Date;
};

export type ToTankLearningInput = {
  tankId: number;
  rows: readonly LearningCurveRow[];
};
