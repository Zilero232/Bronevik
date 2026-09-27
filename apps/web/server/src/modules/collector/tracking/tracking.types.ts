import type { ExpectedValuesTable } from '@otmetki/ratings';
import type { Queue } from 'bullmq';

import type { Prisma, TrackingTier } from '../../../../generated';
import type { LestaClients } from '../../../core';
import type { GainedMark } from './lib/marks-gain';
import type { AccountChanges, LatestTankSnapshotsInput } from './lib/poll-pipeline';

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

export type LatestAccountBattlesInput = {
  tx: Prisma.TransactionClient;
  accountId: number;
};

export type LatestTanksInput = LatestTankSnapshotsInput & {
  tx: Prisma.TransactionClient;
};

export type AccountStoreInput = {
  tx: Prisma.TransactionClient;
  expected: ExpectedValuesTable;
  gained: GainedMark[];
};

export type WriteAccountChangesInput = AccountChanges & AccountStoreInput;

export type RebuildDaySessionInput = Pick<AccountStoreInput, 'expected' | 'tx'> & {
  accountId: bigint;
  at: Date;
};
