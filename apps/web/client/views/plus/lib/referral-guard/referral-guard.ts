import { referralSchema } from '@otmetki/schemas';

import type { ReferralToRegisterInput } from './referral-guard.types';

export const referralToRegister = ({ referrerId, userId, registeredId }: ReferralToRegisterInput): string | null => {
  if (!referrerId || !userId || referrerId === userId || referrerId === registeredId) {
    return null;
  }

  return referralSchema.safeParse({ referrerId }).success ? referrerId : null;
};
