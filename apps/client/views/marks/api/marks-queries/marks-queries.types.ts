import type { MoeListInput } from '@/entities/player/marks';

export type MoeFeedInput = Omit<MoeListInput, 'offset' | 'signal'>;
