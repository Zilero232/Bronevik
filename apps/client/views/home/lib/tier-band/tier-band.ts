import type { TierBand } from './tier-band.types';

import { TIER_BANDS } from '../../config/home.constants';

export const tierBand = (tier: number): TierBand => {
  if (tier >= TIER_BANDS.top) {
    return 'top';
  }

  if (tier >= TIER_BANDS.high) {
    return 'high';
  }

  return tier >= TIER_BANDS.mid ? 'mid' : 'low';
};
