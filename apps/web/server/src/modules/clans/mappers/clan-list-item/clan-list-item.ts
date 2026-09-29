import type { ClanListItem } from '@otmetki/schemas';

import type { ClanListRow } from '../../queries';

import { clampPercent, ratingValue } from '../../../../common/lib';
import { toClanSummary } from '../clan-summary';

export const toClanListItem = (row: ClanListRow): ClanListItem => ({
  clan: toClanSummary(row),
  avgWn8: ratingValue({ kind: 'wn8', value: row.avgWn8 }),
  avgWinRate: clampPercent(row.avgWinRate),
  activeMembers7d: row.activeMembers7d,
  eloRating10: row.eloRating10,
  strongholdLevel: row.strongholdLevel
});
