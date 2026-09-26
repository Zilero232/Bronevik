import type { AddWatchlistPlayerInput, UpdateWatchlistSettingsInput, WatchlistQuery } from '@otmetki/schemas';

import type { WatchlistSettings } from '../../../generated';

export type WatchlistListInput = {
  userId: string;
  query: WatchlistQuery;
};

export type WatchlistAddInput = AddWatchlistPlayerInput & {
  userId: string;
};

export type WatchlistRemoveInput = {
  userId: string;
  accountId: number;
};

export type WatchlistSettingsInput = UpdateWatchlistSettingsInput & {
  userId: string;
};

export type PlayerActivityInput = {
  accountIds: readonly bigint[];
  since: Date;
};

export type PlayerActivity = {
  accountId: bigint;
  battles: number;
  wins: number;
  damage: number;
  lastBattleAt: Date | null;
  marksGained: number;
};

export type SessionSumRow = {
  account_id: bigint;
  battles: number;
  wins: number;
  damage: number;
  last_at: Date | null;
};

export type MarksGainRow = {
  account_id: bigint;
  marks: number;
};

export type DigestForInput = {
  settings: WatchlistSettings;
  now: Date;
};
