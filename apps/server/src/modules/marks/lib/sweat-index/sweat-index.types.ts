export type SweatRatioInput = {
  threshold: number | null | undefined;
  baseline: number | null | undefined;
};

export type SweatCutoffs = {
  moderate: number;
  hard: number;
  extreme: number;
};

export type SweatBaseline = {
  damage: number;
  xp: number;
};

export type BuildSweatIndexInput = {
  tankIds: readonly number[];
  moe: ReadonlyMap<number, number>;
  mastery: ReadonlyMap<number, number>;
  baselines: ReadonlyMap<number, SweatBaseline>;
};

export type QuantileInput = {
  sorted: readonly number[];
  level: number;
};

export type SweatLevelInput = {
  value: number | null;
  cutoffs: SweatCutoffs | null;
};
