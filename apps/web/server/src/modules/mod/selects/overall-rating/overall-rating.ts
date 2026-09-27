import type { Prisma } from '../../../../../generated';

export const OVERALL_RATING_SELECT = {
  battles: true,
  winRate: true,
  avgDamage: true,
  wn8: true,
  eff: true,
  broneIndex: true,
  computedAt: true,
  player: { select: { nickname: true } }
} as const satisfies Prisma.AccountRatingSelect;
