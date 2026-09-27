import type { ClanMember } from '@otmetki/schemas';

import { differenceInDays } from 'date-fns';

import type { ToClanMemberInput } from './clan-member.types';

import { clampPercent, CLAN_ROLE_FROM_DB, emptyRating, ratingValue, toIso, toNumber } from '../../../../common/lib';
import { CLAN_PAGE } from '../../config';

export const toClanMember = ({ row, now }: ToClanMemberInput): ClanMember => {
  const overall = row.player.ratings.find((rating) => rating.period === 'overall');
  const recent = row.player.ratings.find((rating) => rating.period === CLAN_PAGE.recentPeriod);
  const lastBattleAt = row.player.lastBattleAt;

  return {
    accountId: toNumber(row.accountId),
    nickname: row.player.nickname,
    role: CLAN_ROLE_FROM_DB[row.role],
    joinedAt: toIso(row.joinedAt),
    lastBattleAt: toIso(lastBattleAt),
    inactiveDays: lastBattleAt ? Math.max(0, differenceInDays(now, lastBattleAt)) : null,
    battles: overall?.battles ?? null,
    winRate: clampPercent(overall?.winRate),
    wn8: overall ? ratingValue({ kind: 'wn8', value: overall.wn8 }) : emptyRating(),
    recentWn8: recent ? ratingValue({ kind: 'wn8', value: recent.wn8 }) : emptyRating()
  };
};
