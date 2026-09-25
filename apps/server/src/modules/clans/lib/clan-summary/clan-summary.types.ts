import type { Clan } from '../../../../../generated';

export type ClanSummaryRow = Pick<Clan, 'clanId' | 'color' | 'createdAt' | 'emblems' | 'isDisbanded' | 'membersCount' | 'motto' | 'name' | 'tag'>;
