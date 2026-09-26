'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { isPromoRejection, useStartTrial } from '@/entities/plus/subscription';
import { usePlus } from '@/features/plus/plus-gate';

import { PLUS_CHECKOUT_FORM_DEFAULT_VALUES } from '../../../config';
import { checkoutNote } from '../../../lib/checkout-note';
import { usePlusCheckout } from '../use-plus-checkout';
import { usePlusOffers } from '../use-plus-offers';

export const usePlusCheckoutForm = () => {
  const t = useTranslations('plus');
  const offers = usePlusOffers();
  const access = usePlus();
  const checkout = usePlusCheckout();
  const trial = useStartTrial();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues: PLUS_CHECKOUT_FORM_DEFAULT_VALUES });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await checkout.mutateAsync(values);
    } catch (error) {
      if (values.promoCode && isPromoRejection(error)) {
        setError('promoCode', { type: 'server' });

        return;
      }

      toast.error(t('checkout.failed'));
    }
  });

  const onStartTrial = () => trial.mutate();

  return {
    offers,
    access,
    note: checkoutNote(access),
    planRegistration: register('plan'),
    promoRegistration: register('promoCode', { setValueAs: (value: string) => value.trim() || undefined }),
    promoError: errors.promoCode,
    isSubmitting: isSubmitting || checkout.isPending || checkout.isSuccess,
    isStartingTrial: trial.isPending,
    onSubmit,
    onStartTrial
  };
};
