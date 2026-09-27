import type { Prisma } from '../../../../../generated';
import type { EQUIPPED_COSMETICS_SELECT } from './equipped-cosmetics';

export type EquippedCosmeticsRow = Prisma.UserGetPayload<{ select: typeof EQUIPPED_COSMETICS_SELECT }>;
