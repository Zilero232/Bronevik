export type MoeEstimateSqlInput = {
  since: Date;
  steps: number[];
  band: number;
  battleType: string;
};

export type MoeEstimateRow = {
  tankId: number;
  percent: number;
  damage: number;
  players: number;
};
