import type { Prisma } from '../../../../../generated';
import type { CLAN_STRONGHOLD_SELECT } from './clan-stronghold';

export type StoredStronghold = Prisma.ClanGetPayload<{ select: typeof CLAN_STRONGHOLD_SELECT }>;
