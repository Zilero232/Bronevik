import type { MoeListInput } from '@/entities/player/marks';

export type MoeFeedParams = Omit<MoeListInput, 'offset' | 'signal'>;
