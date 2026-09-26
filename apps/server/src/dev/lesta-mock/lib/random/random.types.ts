export type MockRng = {
  float: () => number;
  int: (min: number, max: number) => number;
  chance: (probability: number) => boolean;
  normal: (mean?: number, deviation?: number) => number;
  logNormal: (median: number, sigma: number) => number;
  poisson: (mean: number) => number;
  pick: <T>(items: readonly T[]) => T;
  weighted: <T>(items: readonly T[], weight: (item: T) => number) => T;
  shuffle: <T>(items: readonly T[]) => T[];
};
