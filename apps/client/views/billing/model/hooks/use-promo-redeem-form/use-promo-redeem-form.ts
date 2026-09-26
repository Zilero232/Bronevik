'use client';

import type { PromoRedeemInput } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { promoRedeemSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { isPromoRejection } from '@/entities/plus/subscription';

import { PROMO_REDEEM_FORM_DEFAULT_VALUES } from '../../../config';
import { useRedeemPromo } from '../use-redeem-promo';

export const usePromoRedeemForm = () => {
  const t = useTranslations('billing.toast');
  const redeem = useRedeemPromo();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PromoRedeemInput>({ resolver: zodResolver(promoRedeemSchema), defaultValues: PROMO_REDEEM_FORM_DEFAULT_VALUES });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await redeem.mutateAsync(values);
      reset(PROMO_REDEEM_FORM_DEFAULT_VALUES);
    } catch (error) {
      if (isPromoRejection(error)) {
        setError('code', { type: 'server' });

        return;
      }

      toast.error(t('failed'));
    }
  });

  return { register, onSubmit, error: errors.code, isSubmitting };
};
