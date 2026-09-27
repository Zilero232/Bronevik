import type { Prisma } from '../../../../../generated';

export const LATEST_SESSION_SELECT = {
  kind: true,
  source: true,
  status: true,
  startedAt: true,
  endedAt: true,
  battles: true,
  wins: true,
  damageDealt: true,
  wn8: true,
  broneIndex: true
} as const satisfies Prisma.PlaySessionSelect;

export const LATEST_SESSION_ORDER = { startedAt: 'desc' } as const satisfies Prisma.PlaySessionOrderByWithRelationInput;
