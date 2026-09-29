'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { PROMO_CODE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { usePlus } from '@/features/plus/plus-gate';

import { normalizePromoCode } from '../../../lib/promo-code';

export const usePromoField = () => {
  const t = useTranslations('plus.checkout.promo');
  const id = useId();
  const { isSignedIn, isPlus, isCheckoutAvailable } = usePlus();
  const {
    register,
    formState: { errors }
  } = useFormContext<CheckoutInput>();

  const error = errors.promoCode;

  return {
    id,
    hintId: `${id}-hint`,
    isShown: isSignedIn && !isPlus && isCheckoutAvailable,
    isInvalid: Boolean(error),
    message: error ? (error.type === 'server' ? t('rejected') : t('invalid', { min: PROMO_CODE.minLength, max: PROMO_CODE.maxLength })) : t('hint'),
    field: register('promoCode', { setValueAs: normalizePromoCode })
  };
};
