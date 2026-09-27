'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { isPromoRejection } from '@/entities/plus/subscription';

import { PLUS_CHECKOUT_FORM_DEFAULT_VALUES } from '../../../config';
import { usePlusCheckout } from '../use-plus-checkout';

export const usePlusCheckoutForm = () => {
  const t = useTranslations('plus');
  const checkout = usePlusCheckout();
  const form = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues: PLUS_CHECKOUT_FORM_DEFAULT_VALUES });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await checkout.mutateAsync(values);
    } catch (error) {
      if (values.promoCode && isPromoRejection(error)) {
        form.setError('promoCode', { type: 'server' });

        return;
      }

      form.setError('root.server', { type: 'server' });
      toast.error(t('checkout.failed'));
    }
  });

  return { form, onSubmit };
};
