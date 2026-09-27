import type { Prisma } from '../../../../../generated';
import type { CLAN_MEMBER_INCLUDE } from './clan-member';

export type ClanMemberRow = Prisma.ClanMemberGetPayload<{ include: typeof CLAN_MEMBER_INCLUDE }>;
