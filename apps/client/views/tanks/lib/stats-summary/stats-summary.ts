import type { TankServerStatsRow } from '@otmetki/schemas';

import { firstBy, sortBy, sumBy } from 'remeda';

import type { StatsSummary } from './stats-summary.types';

import { TANKS_VIEW } from '../../config';

export const summarizeStats = (rows: readonly TankServerStatsRow[]): StatsSummary => ({
  tanks: rows.length,
  battles: sumBy(rows, (row) => row.battles),
  strongest: firstBy(rows, [(row) => row.winRateDiff, 'desc']),
  mostPlayed: firstBy(rows, [(row) => row.battles, 'desc']),
  leaders: sortBy(rows, [(row) => row.winRateDiff, 'desc']).slice(0, TANKS_VIEW.heroTanks)
});
