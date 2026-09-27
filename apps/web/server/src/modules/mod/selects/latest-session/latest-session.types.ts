import type { Prisma } from '../../../../../generated';
import type { LATEST_SESSION_SELECT } from './latest-session';

export type LatestSessionRow = Prisma.PlaySessionGetPayload<{ select: typeof LATEST_SESSION_SELECT }>;
