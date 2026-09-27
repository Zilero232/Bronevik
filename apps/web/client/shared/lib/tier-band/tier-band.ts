import type { TierBand } from './tier-band.types';

import { TIER_BAND } from './tier-band.constants';

export const tierBand = (tier: number): TierBand => {
  if (tier >= TIER_BAND.topFrom) {
    return 'top';
  }

  if (tier >= TIER_BAND.highFrom) {
    return 'high';
  }

  return tier >= TIER_BAND.midFrom ? 'mid' : 'low';
};
