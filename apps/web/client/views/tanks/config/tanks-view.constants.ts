import { ECONOMY_ACCOUNTS, LEARNING_DIFFICULTIES, serverPeriodSchema, skillCohortSchema, statsModeSchema } from '@otmetki/schemas';
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsStringLiteral } from 'nuqs/server';

export const TANKS_VIEWS = ['table', 'tierlist', 'economy'] as const;

export const TIER_LIST_TIERS = [6, 7, 8, 9, 10] as const;

export const TANKS_VIEW = {
  statsLimit: 100,
  top: { sort: 'winRate', order: 'desc', limit: 10 },
  defaultTier: 10,
  rowHeight: 44,
  tierListSkeleton: 320,
  heroTanks: 5,
  chipItems: 2,
  compactNumber: { notation: 'compact', maximumFractionDigits: 1 }
} as const;

export const TANKS_QUERY_PARSERS = {
  period: parseAsStringLiteral(serverPeriodSchema.options).withDefault('7d'),
  cohort: parseAsStringLiteral(skillCohortSchema.options).withDefault('all'),
  mode: parseAsStringLiteral(statsModeSchema.options).withDefault('all'),
  view: parseAsStringLiteral(TANKS_VIEWS).withDefault('table'),
  tier: parseAsInteger.withDefault(TANKS_VIEW.defaultTier),
  difficulties: parseAsArrayOf(parseAsStringLiteral(LEARNING_DIFFICULTIES)).withDefault([]),
  top: parseAsBoolean.withDefault(false),
  pinned: parseAsBoolean.withDefault(false),
  account: parseAsStringLiteral(ECONOMY_ACCOUNTS).withDefault('premium'),
  reserve: parseAsBoolean.withDefault(false),
  clanPayout: parseAsBoolean.withDefault(false)
} as const;

export const TANKS_ECONOMY = {
  limit: 100,
  myDays: 30,
  myTanks: 5,
  mySkeletonHeight: 120,
  accounts: ['premium', 'standard'],
  cardFigures: ['net', 'credits', 'xp']
} as const;
