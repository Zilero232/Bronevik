import type { PlayMode, VehicleType } from '@otmetki/schemas';

export type SignalInput = {
  signal?: AbortSignal;
};

export type ModeMetaInput = SignalInput & {
  mode: PlayMode;
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  minBattles?: number;
};

export type MyModeStatsInput = SignalInput & {
  days: number;
};
