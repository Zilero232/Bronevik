import type { Prisma } from '../../../../../generated';

export const SESSION_CARD_SELECT = {
  id: true,
  accountId: true,
  battles: true,
  wins: true,
  damageDealt: true,
  wn8: true,
  player: { select: { nickname: true } }
} as const satisfies Prisma.PlaySessionSelect;
