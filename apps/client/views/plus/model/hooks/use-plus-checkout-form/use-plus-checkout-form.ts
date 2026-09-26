'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PLUS_CHECKOUT_FORM_DEFAULT_VALUES } from '../../../config';
import { usePlusAccess } from '../use-plus-access';
import { usePlusCheckout } from '../use-plus-checkout';
import { usePlusOffers } from '../use-plus-offers';

export const usePlusCheckoutForm = () => {
  const t = useTranslations('plus.checkout');
  const offers = usePlusOffers();
  const access = usePlusAccess();
  const checkout = usePlusCheckout();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues: PLUS_CHECKOUT_FORM_DEFAULT_VALUES });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await checkout.mutateAsync(values);
    } catch {
      if (values.promoCode) {
        setError('promoCode', { type: 'server' });

        return;
      }

      toast.error(t('failed'));
    }
  });

  return {
    offers,
    access,
    planRegistration: register('plan'),
    promoRegistration: register('promoCode', { setValueAs: (value: string) => value.trim() || undefined }),
    promoError: errors.promoCode,
    isSubmitting: isSubmitting || checkout.isPending || checkout.isSuccess,
    onSubmit
  };
};
