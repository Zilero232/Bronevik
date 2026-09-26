import { serverPeriodSchema, skillCohortSchema } from '@bronevik/schemas';
import { parseAsInteger, parseAsStringLiteral } from 'nuqs';

export const TANKS_VIEWS = ['table', 'tierlist'] as const;

export const TIER_LIST_TIERS = [6, 7, 8, 9, 10] as const;

export const TANKS_VIEW = {
  statsLimit: 100,
  defaultTier: 10,
  rowHeight: 44,
  tierListSkeleton: 320,
  compactNumber: { notation: 'compact', maximumFractionDigits: 1 }
} as const;

export const TANKS_QUERY_PARSERS = {
  period: parseAsStringLiteral(serverPeriodSchema.options).withDefault('7d'),
  cohort: parseAsStringLiteral(skillCohortSchema.options).withDefault('all'),
  view: parseAsStringLiteral(TANKS_VIEWS).withDefault('table'),
  tier: parseAsInteger.withDefault(TANKS_VIEW.defaultTier)
};
