'use client';

import { REFERRAL } from '@otmetki/schemas';
import { useSessionStorage } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useEffectEvent } from 'react';

import { useAuthSession } from '@/entities/auth/session';

import { registerReferral } from '../../../api';
import { REFERRAL_STORAGE } from '../../../config';
import { referralToRegister } from '../../../lib/referral-guard';

export const useReferralCapture = () => {
  const [referrerId] = useQueryState(REFERRAL.param, parseAsString);
  const { data: session } = useAuthSession();
  const registered = useSessionStorage<string>(REFERRAL_STORAGE.key);
  const referral = useMutation({ mutationFn: registerReferral, onError: registered.remove });

  const userId = session?.user.id ?? null;

  const register = useEffectEvent(() => {
    const candidate = referralToRegister({ referrerId, userId, registeredId: registered.value ?? null });

    if (!candidate) {
      return;
    }

    registered.set(candidate);
    referral.mutate({ referrerId: candidate });
  });

  useEffect(() => {
    register();
  }, [referrerId, userId]);
};
