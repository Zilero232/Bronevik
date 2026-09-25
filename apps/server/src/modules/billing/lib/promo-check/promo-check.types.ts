import type { PromoCode } from '../../../../../generated';

export type PromoRejection = 'alreadyRedeemed' | 'exhausted' | 'expired' | 'unknown' | 'wrongProduct';

export type PromoCheckInput = {
  promo: Pick<PromoCode, 'expiresAt' | 'maxUses' | 'product' | 'usedCount'> | null;
  now: Date;
  alreadyRedeemed: boolean;
};
