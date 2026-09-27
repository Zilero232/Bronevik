import type { Prisma } from '../../../../../generated';

export const COLLECTOR_ROW_SELECT = {
  accountId: true,
  held: true,
  points: true,
  completion: true,
  player: { select: { nickname: true, clanId: true } }
} as const satisfies Prisma.AccountAchievementsSelect;

export const RANKED_COLLECTORS = { computedAt: { not: null }, player: { isHidden: false } } as const satisfies Prisma.AccountAchievementsWhereInput;
