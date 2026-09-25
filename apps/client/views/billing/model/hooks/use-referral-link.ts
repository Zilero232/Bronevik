'use client';

import { useAuthSession } from '@/entities/auth/session';
import { useHydrated } from '@/shared/lib';

import { referralLink } from '../../lib/referral-link';

export const useReferralLink = () => {
  const { data: session } = useAuthSession();
  const isHydrated = useHydrated();

  return isHydrated && session ? referralLink({ origin: window.location.origin, userId: session.user.id }) : null;
};
