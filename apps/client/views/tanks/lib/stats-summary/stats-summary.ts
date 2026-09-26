import type { TankServerStatsRow } from '@otmetki/schemas';

import { firstBy, sumBy } from 'remeda';

import type { StatsSummary } from './stats-summary.types';

export const summarizeStats = (rows: readonly TankServerStatsRow[]): StatsSummary => ({
  tanks: rows.length,
  battles: sumBy(rows, (row) => row.battles),
  strongest: firstBy(rows, [(row) => row.winRateDiff, 'desc']),
  mostPlayed: firstBy(rows, [(row) => row.battles, 'desc'])
});
