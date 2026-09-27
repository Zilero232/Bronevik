import type { LeagueEntry } from '../../../api';
import type { UseLeagueColumnsInput } from '../../../model/hooks';

export type LeagueTableProps = UseLeagueColumnsInput & {
  entries: LeagueEntry[];
};
