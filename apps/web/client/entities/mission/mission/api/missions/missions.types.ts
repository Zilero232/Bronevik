import type { ServerPeriod } from '@otmetki/schemas';

export type SignalInput = {
  signal?: AbortSignal;
};

export type MissionOperationInput = SignalInput & {
  campaign: number;
  operation: number;
};

export type MissionTanksInput = SignalInput & {
  questId: number;
  period?: ServerPeriod;
};

export type MissionQuestInput = SignalInput & {
  questId: number;
};

export type MissionPlanInput = SignalInput & {
  operation: number;
};
