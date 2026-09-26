export type LevelProgressInput = {
  current: number;
  start: number;
  next: number | null;
};

export type LevelProgress = {
  value: number;
  max: number;
  isMax: boolean;
};
