import type { ReplayStatus } from '@/entities/replay/replay';

import { REPLAY_PAGE } from '../../config';

const PENDING = new Set<ReplayStatus>(REPLAY_PAGE.pendingStatuses);

export const isReplayPending = (status: ReplayStatus | undefined): boolean => status !== undefined && PENDING.has(status);
