import type { STAGE_METRICS } from '../../config';
import type { MockPlayer, MockPlayerState, MockTankState, MockWorld } from '../../lesta-mock.types';

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
