import type { ReplayFilters } from '../../../lib/replay-query';

export type ReplayFiltersPatch = Partial<Omit<ReplayFilters, 'offset'>>;
