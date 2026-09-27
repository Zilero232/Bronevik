import { ECONOMY_ACCOUNTS, LEARNING_DIFFICULTIES, serverPeriodSchema, skillCohortSchema, TANK_ROLES, TANK_STATUSES } from '@otmetki/schemas';
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsStringLiteral } from 'nuqs';

export const TANKS_VIEWS = ['table', 'tierlist', 'economy'] as const;

export const ANY_ROLE = 'any';

export const TIER_LIST_TIERS = [6, 7, 8, 9, 10] as const;

export const TANKS_VIEW = {
  statsLimit: 100,
  defaultTier: 10,
  rowHeight: 44,
  tierListSkeleton: 320,
  heroTanks: 5,
  compactNumber: { notation: 'compact', maximumFractionDigits: 1 }
} as const;

export const TANKS_QUERY_PARSERS = {
  period: parseAsStringLiteral(serverPeriodSchema.options).withDefault('7d'),
  cohort: parseAsStringLiteral(skillCohortSchema.options).withDefault('all'),
  view: parseAsStringLiteral(TANKS_VIEWS).withDefault('table'),
  tier: parseAsInteger.withDefault(TANKS_VIEW.defaultTier),
  statuses: parseAsArrayOf(parseAsStringLiteral(TANK_STATUSES)).withDefault([]),
  roles: parseAsArrayOf(parseAsStringLiteral(TANK_ROLES)).withDefault([]),
  difficulties: parseAsArrayOf(parseAsStringLiteral(LEARNING_DIFFICULTIES)).withDefault([]),
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
