import type { TankServerStatsRow } from '@bronevik/schemas';

import { firstBy } from 'remeda';

import type { StatsSummary } from './stats-summary.types';

export const summarizeStats = (rows: readonly TankServerStatsRow[]): StatsSummary => ({
  tanks: rows.length,
  battles: rows.reduce((sum, row) => sum + row.battles, 0),
  strongest: firstBy(rows, [(row) => row.winRateDiff, 'desc']),
  mostPlayed: firstBy(rows, [(row) => row.battles, 'desc'])
});
