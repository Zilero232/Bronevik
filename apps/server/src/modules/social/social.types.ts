import type { Follow } from '@otmetki/schemas';
import type { z } from 'zod';

import type { TargetKind } from '../../../generated';
import type { challengesSchema, feedItemSchema, leagueSchema, wrappedSchema } from './dto/social.schemas';
import type { ChallengeDefinition, WeekStats } from './lib/challenges';
import type { LeagueMetric } from './lib/league';

export type FollowView = Follow;
export type FeedItem = z.infer<typeof feedItemSchema>;
export type LeagueView = z.infer<typeof leagueSchema>;
export type ChallengesView = z.infer<typeof challengesSchema>;
export type WrappedView = z.infer<typeof wrappedSchema>;

export type CreateFollowInput = { userId: string; kind: TargetKind; targetId: number };
export type RemoveFollowInput = { userId: string; id: string };
export type FeedInput = { userId: string; days: number };
export type LeagueInput = { userId: string; metric: LeagueMetric; week: string | undefined };
export type WrappedInput = { accountId: number; year: number };

export type SnapshotEventRow = {
  account_id: bigint;
  tank_id: number;
  captured_at: Date;
  marks_on_gun: number | null;
  prev_marks: number | null;
  mark_of_mastery: number;
  prev_mastery: number | null;
};

export type RecordEventRow = {
  account_id: bigint;
  captured_at: Date;
  max_damage: number | null;
  prev_max_damage: number | null;
  max_damage_tank_id: number | null;
};

export type SnapshotWindow = {
  accountIds: readonly bigint[];
  since: Date;
  until: Date;
};

export type SignatureData = {
  nickname: string;
  clanTag: string | null;
  battles: number | null;
  winRate: number | null;
  wn8: number | null;
  avgDamage: number | null;
};

export type YearTankRow = { tank_id: number; battles: number; damage: bigint };
export type YearTotalsRow = { battles: number; wins: number; damage: bigint; frags: number };

export type FollowCircle = {
  accountIds: bigint[];
  own: Set<bigint>;
};

export type WeekStatsInput = {
  accountIds: bigint[];
  start: Date;
  end: Date;
};

export type RecordChallengeInput = {
  accountId: bigint;
  weekStart: Date;
  definition: ChallengeDefinition;
  stats: WeekStats;
  now: Date;
};

export type MonthRow = {
  month: number;
  battles: number;
};
