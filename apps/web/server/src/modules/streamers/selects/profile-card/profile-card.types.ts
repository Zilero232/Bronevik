import type { Prisma } from '../../../../../generated';
import type { PROFILE_CARD_INCLUDE } from './profile-card';

export type ProfileCardRow = Prisma.StreamerProfileGetPayload<{ include: typeof PROFILE_CARD_INCLUDE }>;
