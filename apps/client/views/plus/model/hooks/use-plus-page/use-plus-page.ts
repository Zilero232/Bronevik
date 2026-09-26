'use client';

import { usePlus } from '@/features/plus/plus-gate';

import { usePlusOffers } from '../use-plus-offers';
import { useReferralCapture } from '../use-referral-capture';

export const usePlusPage = () => {
  const { trialAvailable, trialDays, isSignedIn } = usePlus();
  const { fromMonthlyRub } = usePlusOffers();

  useReferralCapture();

  return { isTrialOffered: trialAvailable || !isSignedIn, trialDays, fromMonthlyRub };
};
