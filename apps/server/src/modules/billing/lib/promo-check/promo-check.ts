import type { PromoCheckInput, PromoRejection } from './promo-check.types';

import { PLUS_SUBSCRIPTION } from '../../config';

export const promoRejection = ({ promo, now, alreadyRedeemed }: PromoCheckInput): PromoRejection | null => {
  if (!promo) {
    return 'unknown';
  }

  if (promo.product !== null && promo.product !== PLUS_SUBSCRIPTION.product) {
    return 'wrongProduct';
  }

  if (promo.expiresAt !== null && promo.expiresAt <= now) {
    return 'expired';
  }

  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return 'exhausted';
  }

  return alreadyRedeemed ? 'alreadyRedeemed' : null;
};
