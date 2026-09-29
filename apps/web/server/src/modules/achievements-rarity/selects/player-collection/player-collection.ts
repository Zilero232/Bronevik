import type { Prisma } from '../../../../../generated';

export const PLAYER_COLLECTION_SELECT = {
  nickname: true,
  isHidden: true,
  achievementSet: { select: { counts: true, maxSeries: true, held: true, points: true, completion: true, fetchedAt: true, computedAt: true } },
  lestaLinks: { select: { userId: true } }
} as const satisfies Prisma.PlayerSelect;
