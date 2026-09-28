import type { LeagueEntry } from '@/entities/social/league';

import type { UseLeagueColumnsInput } from '../../../model/hooks';

export type LeagueTableProps = UseLeagueColumnsInput & {
  entries: LeagueEntry[];
};
