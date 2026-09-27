import { LEAGUE_METRICS, LEAGUE_SCOPES } from '@otmetki/schemas';
import { parseAsString, parseAsStringLiteral } from 'nuqs';

import type { DataTableRowTint, LegendTone } from '@/ui-kit';

import type { LeagueScope, LeagueZone } from '../api';

export const LEAGUE_PARSERS = {
  scope: parseAsStringLiteral(LEAGUE_SCOPES).withDefault('division').withOptions({ history: 'replace' }),
  metric: parseAsStringLiteral(LEAGUE_METRICS).withDefault('damage').withOptions({ history: 'replace' }),
  week: parseAsString.withOptions({ history: 'replace' })
} as const;

export const LEAGUE_VIEW = {
  staleMs: 5 * 60_000,
  daysPerWeek: 7,
  skeletonHeight: 420
} as const;

export const LEAGUE_ZONE_TINTS = {
  promotion: 'good',
  relegation: 'bad',
  stay: null
} as const satisfies Record<LeagueZone, DataTableRowTint | null>;

export const LEAGUE_LEGEND = {
  division: [
    { key: 'promotion', tone: 'success' },
    { key: 'relegation', tone: 'danger' },
    { key: 'unranked', tone: 'neutral' }
  ],
  friends: [{ key: 'unranked', tone: 'neutral' }]
} as const satisfies Record<LeagueScope, readonly { key: string; tone: LegendTone }[]>;
