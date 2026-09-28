import type { Prisma } from '../../../../../generated';
import type { MOD_REPLAY_STATUS_SELECT } from './mod-replay-status';

export type ModReplayStatusRow = Prisma.ReplayGetPayload<{ select: typeof MOD_REPLAY_STATUS_SELECT }>;
