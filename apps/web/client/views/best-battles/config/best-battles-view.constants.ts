import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server';

import { BEST_BATTLE, BEST_BATTLE_METRICS, BEST_BATTLE_PERIODS } from '@/entities/battle/best-battle';

export const BEST_BATTLES_URL_PARSERS = {
  period: parseAsStringLiteral(BEST_BATTLE_PERIODS).withDefault(BEST_BATTLE.defaultPeriod),
  metric: parseAsStringLiteral(BEST_BATTLE_METRICS).withDefault(BEST_BATTLE.defaultMetric),
  tank: parseAsInteger,
  map: parseAsString,
  medal: parseAsString
} as const;

export const BEST_BATTLES_VIEW = {
  pageSize: 25,
  firstOffset: 0,
  podiumSize: 3,
  anyValue: 'any',
  staleMs: 60_000,
  medalsInRow: 4,
  chipMedalSize: 20,
  skeletonHeight: 480
} as const;
