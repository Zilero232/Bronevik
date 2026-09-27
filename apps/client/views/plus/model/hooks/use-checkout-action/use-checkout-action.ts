'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { useFormState } from 'react-hook-form';

import { useLoginHref } from '@/entities/auth/session';
import { useStartTrial } from '@/entities/plus/subscription';
import { usePlus } from '@/features/plus/plus-gate';

import { checkoutNote } from '../../../lib/checkout-note';

export const useCheckoutAction = () => {
  const loginHref = useLoginHref();
  const access = usePlus();
  const trial = useStartTrial();
  const { isSubmitting, isSubmitSuccessful } = useFormState<CheckoutInput>();

  return {
    access,
    loginHref,
    isTrialPending: trial.isPending,
    startTrial: () => trial.mutate(),
    isRedirecting: isSubmitting || isSubmitSuccessful,
    note: checkoutNote(access)
  };
};
