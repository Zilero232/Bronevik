'use client';

import { useMutation } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { useAuthSession } from '@/entities/auth/session';
import { REFERRAL, registerReferral } from '@/shared/api/billing';

import { REFERRAL_STORAGE } from '../../config';
import { referralToRegister } from '../../lib/referral-guard';

export const useReferralCapture = () => {
  const [referrerId] = useQueryState(REFERRAL.param, parseAsString);
  const { data: session } = useAuthSession();
  const referral = useMutation({
    mutationFn: registerReferral,
    onError: () => window.sessionStorage.removeItem(REFERRAL_STORAGE.key)
  });

  const userId = session?.user.id ?? null;

  useEffect(() => {
    const candidate = referralToRegister({ referrerId, userId, registeredId: window.sessionStorage.getItem(REFERRAL_STORAGE.key) });

    if (!candidate) {
      return;
    }

    window.sessionStorage.setItem(REFERRAL_STORAGE.key, candidate);
    referral.mutate({ referrerId: candidate });
    // eslint-disable-next-line react/exhaustive-deps -- register once per referrer and user; the mutation object is rebuilt every render
  }, [referrerId, userId]);
};
