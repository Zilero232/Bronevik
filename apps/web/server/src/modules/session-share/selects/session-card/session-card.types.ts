import type { Prisma } from '../../../../../generated';
import type { SESSION_CARD_SELECT } from './session-card';

export type SessionCardRow = Prisma.PlaySessionGetPayload<{ select: typeof SESSION_CARD_SELECT }>;
