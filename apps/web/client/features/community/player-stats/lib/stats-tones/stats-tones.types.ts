import type { Coach } from '@/shared/api/generated';
import type { RatingTone } from '@/shared/lib';

export type CommunityPlayerStats = NonNullable<Coach['stats']>;

export type StatsTones = {
  wn8: RatingTone | null;
  winRate: RatingTone | null;
};
