import type { ClanSummary } from '@bronevik/schemas';

import type { ClanSummaryRow } from './clan-summary.types';

import { clanEmblem, toIso, toNumber } from '../../../../common/lib';

export const toClanSummary = (clan: ClanSummaryRow): ClanSummary => ({
  clanId: toNumber(clan.clanId),
  tag: clan.tag,
  name: clan.name,
  color: clan.color,
  motto: clan.motto,
  emblem: clanEmblem(clan.emblems),
  membersCount: clan.membersCount,
  createdAt: toIso(clan.createdAt),
  isDisbanded: clan.isDisbanded
});
