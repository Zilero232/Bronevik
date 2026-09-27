import type { RatingTone } from '@/shared/lib';

export type CommunityPlayerStats = {
  battles: number;
  wn8: number | null;
  winRate: number | null;
};

export type StatsTones = {
  wn8: RatingTone | null;
  winRate: RatingTone | null;
};
