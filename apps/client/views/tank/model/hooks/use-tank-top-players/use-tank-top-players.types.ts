import type { PlayerIdentityData } from '@/entities/player/player';
import type { RatingTone } from '@/shared/lib';

export type TopPlayerRow = {
  key: string;
  rank: number;
  isPodium: boolean;
  player: PlayerIdentityData;
  battles: string;
  value: string;
  tone: RatingTone;
};
