'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { PROMO_CODE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { usePlus } from '@/features/plus/plus-gate';
import { Input } from '@/ui-kit';

import { normalizePromoCode } from '../../../../../lib/promo-code';

import s from './PromoField.module.scss';

export const PromoField = () => {
  const t = useTranslations('plus.checkout.promo');
  const id = useId();
  const { isSignedIn, isPlus, isCheckoutAvailable } = usePlus();
  const {
    register,
    formState: { errors }
  } = useFormContext<CheckoutInput>();

  if (!isSignedIn || isPlus || !isCheckoutAvailable) {
    return null;
  }

  const error = errors.promoCode;

  const message = error && (error.type === 'server' ? t('rejected') : t('invalid', { min: PROMO_CODE.minLength, max: PROMO_CODE.maxLength }));

  return (
    <div className={s.root}>
      <label className={s.label} htmlFor={id}>
        {t('label')}
      </label>
      <Input
        aria-describedby={`${id}-hint`}
        aria-invalid={Boolean(error)}
        autoComplete='off'
        id={id}
        isInvalid={Boolean(error)}
        maxLength={PROMO_CODE.maxLength}
        placeholder={t('placeholder')}
        spellCheck={false}
        {...register('promoCode', { setValueAs: normalizePromoCode })}
      />
      <p className={s.hint} data-invalid={Boolean(error)} id={`${id}-hint`} role={error ? 'alert' : undefined}>
        {message ?? t('hint')}
      </p>
    </div>
  );
};
