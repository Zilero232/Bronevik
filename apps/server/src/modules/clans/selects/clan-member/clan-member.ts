import type { Prisma } from '../../../../../generated';

import { CLAN_PAGE } from '../../config';

export const CLAN_MEMBER_INCLUDE = {
  player: {
    select: {
      nickname: true,
      lastBattleAt: true,
      ratings: { where: { period: { in: ['overall', CLAN_PAGE.recentPeriod] } } }
    }
  }
} as const satisfies Prisma.ClanMemberInclude;
