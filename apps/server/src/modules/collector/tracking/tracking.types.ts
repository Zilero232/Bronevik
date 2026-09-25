import type { Queue } from 'bullmq';

import type { TrackingTier } from '../../../../generated';
import type { LestaClients } from '../../../core';

export type { PollResult } from './lib/poll-pipeline';

export type RunPipelineInput = {
  accountIds: readonly number[];
  lane: keyof LestaClients;
  tier: TrackingTier;
  promote?: boolean;
};

export type SweepTier = Extract<TrackingTier, 'dormant' | 'population'>;

export type SeedResult = {
  accounts: number;
  clans: number;
};

export type EnqueueBatchesInput = {
  queue: Queue;
  name: string;
  accountIds: readonly number[];
  priority?: number;
};
