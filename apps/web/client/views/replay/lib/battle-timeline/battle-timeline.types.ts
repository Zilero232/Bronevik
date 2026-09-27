import type { ReplayPlayer } from '@/entities/replay/replay';

export type AliveSeriesInput = {
  players: readonly ReplayPlayer[];
  recorderTeam: number;
  durationSec: number | null;
  maxPoints: number;
  minStepSec: number;
};

export type AliveSeries = {
  times: number[];
  allies: number[];
  enemies: number[];
};

export type KillEvent = {
  timeSec: number;
  victim: ReplayPlayer;
  killer: ReplayPlayer | null;
  isAllyLoss: boolean;
};

export type KillEventsInput = {
  players: readonly ReplayPlayer[];
  recorderTeam: number;
};

export type AliveAtInput = {
  players: readonly ReplayPlayer[];
  timeSec: number;
};
