import type { PromoCode } from '../../../../../generated';

export type PromoRejection = 'alreadyRedeemed' | 'exhausted' | 'expired' | 'unknown';

export type PromoCheckInput = {
  promo: Pick<PromoCode, 'expiresAt' | 'maxUses' | 'usedCount'> | null;
  now: Date;
  alreadyRedeemed: boolean;
};
