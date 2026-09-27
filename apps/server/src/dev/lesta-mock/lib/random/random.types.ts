export type MockRng = {
  float: () => number;
  int: (input: IntInput) => number;
  chance: (probability: number) => boolean;
  normal: (input?: NormalInput) => number;
  logNormal: (input: LogNormalInput) => number;
  poisson: (mean: number) => number;
  pick: <T>(items: readonly T[]) => T;
  weighted: <T>(input: WeightedInput<T>) => T;
  shuffle: <T>(items: readonly T[]) => T[];
};

export type NormalInput = {
  mean?: number;
  deviation?: number;
};

export type WeightedInput<T> = {
  items: readonly T[];
  weight: (item: T) => number;
};

export type IntInput = {
  min: number;
  max: number;
};

export type LogNormalInput = {
  median: number;
  sigma: number;
};
