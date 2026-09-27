import type { StreamerChallenge } from '@/entities/streamer/streamer';

export type UseChallengeCardInput = Pick<StreamerChallenge, 'amount' | 'currency' | 'expiresAt'>;
