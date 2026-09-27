import type { Prisma } from '../../../../../generated';

export const CLAN_STRONGHOLD_SELECT = {
  strongholdLevel: true,
  stronghold: true,
  strongholdUpdatedAt: true
} as const satisfies Prisma.ClanSelect;
