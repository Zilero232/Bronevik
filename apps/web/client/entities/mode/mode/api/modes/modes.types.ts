import type { PlayMode } from '@otmetki/schemas';

import type { ModesControllerModeMetaData } from '@/shared/api/generated';

export type SignalInput = {
  signal?: AbortSignal;
};

export type ModeMetaInput = SignalInput &
  NonNullable<ModesControllerModeMetaData['query']> & {
    mode: PlayMode;
  };

export type MyModeStatsInput = SignalInput & {
  days: number;
};
