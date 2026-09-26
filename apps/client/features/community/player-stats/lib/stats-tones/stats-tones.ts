import { ratingTone } from '@/shared/lib';

import type { CommunityPlayerStats, StatsTones } from './stats-tones.types';

export const winRatePercent = (winRate: number | null): number | null => (winRate === null ? null : winRate * 100);

export const statsTones = ({ wn8, winRate }: Pick<CommunityPlayerStats, 'winRate' | 'wn8'>): StatsTones => {
  const percent = winRatePercent(winRate);

  return {
    wn8: wn8 === null ? null : ratingTone({ scale: 'wn8', value: wn8 }),
    winRate: percent === null ? null : ratingTone({ scale: 'winRate', value: percent })
  };
};
