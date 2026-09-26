import type { InsightsPeriod, PlayerTanksQuery, Playtime, PopularPlayersQuery, TimeSeriesQuery } from '@otmetki/schemas';

import type { AccountRating, AccountSnapshot, Battle } from '../../../generated';
import type { AccountInfo } from '../../lib/lesta';

export type LestaPlayerInfo = AccountInfo;

export type FromSnapshotInput = {
  snapshot: AccountSnapshot;
  rating: AccountRating | null;
};

export type PlayerTanksInput = {
  accountId: bigint;
  query: PlayerTanksQuery;
};

export type LatestTankSnapshot = {
  tank_id: number;
  battles: number;
  wins: number;
  damage_dealt: number;
  frags: number;
  xp: number;
  survived_battles: number;
  max_frags: number | null;
  max_xp: number | null;
};

export type HistoryInput = {
  accountId: bigint;
  query: TimeSeriesQuery;
};

export type ActivityInput = {
  accountId: bigint;
  days: number;
};

export type ActivityRow = {
  day: string;
  battles: number;
  wins: number;
};

export type SessionsInput = {
  accountId: bigint;
  limit: number;
  offset: number;
};

export type SessionDetailInput = {
  accountId: bigint;
  sessionId: string;
};

export type SessionBattleInput = {
  battle: Battle;
  mapName: Map<string, string>;
};

export type InsightsInput = {
  accountId: bigint;
  period: InsightsPeriod;
};

export type PlaytimeRow = {
  weekday: number;
  hour: number;
  battles: number;
  wins: number;
  damage: number;
};

export type CombinedDamageRow = {
  tank_id: number;
  battles: number;
  combined: number;
};

export type PopularPlayersInput = PopularPlayersQuery;

export type PlaytimeResultInput = {
  rows: PlaytimeRow[];
  source: Playtime['source'];
};

export type PlaytimeWindowInput = {
  accountId: bigint;
  from: Date;
};

export type PopularRow = {
  accountId: bigint;
  views: number;
};
