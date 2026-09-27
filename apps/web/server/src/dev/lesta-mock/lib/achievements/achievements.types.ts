import type { VehicleType } from '@otmetki/schemas';

import type { MOCK_SERIES, STAGE_METRICS } from '../../config';
import type { MockPlayer, MockPlayerState, MockTankState, MockTotals, MockWorld } from '../../lesta-mock.types';

export type StageMetric = (typeof STAGE_METRICS)[number];

export type AccountAchievementsInput = {
  world: MockWorld;
  player: MockPlayer;
  state: MockPlayerState;
};

export type TankAchievementsInput = {
  world: MockWorld;
  player: MockPlayer;
  tank: MockTankState;
};

export type AchievementCounts = {
  achievements: Record<string, number>;
  max_series: Record<string, number>;
};

export type JitterInput = {
  seed: number;
  index: number;
  key: number;
};

export type BattlesOfTypeInput = {
  state: MockPlayerState;
  type: VehicleType | undefined;
};

export type StageMetricsInput = {
  state: MockPlayerState;
  totals: MockTotals;
  heroes: number;
};

export type SeriesValueInput = {
  series: keyof typeof MOCK_SERIES;
  perf: number;
  battles: number;
  spread: number;
};
