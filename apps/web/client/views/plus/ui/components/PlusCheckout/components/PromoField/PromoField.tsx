'use client';

import { PROMO_CODE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { Input } from '@/ui-kit';

import { usePromoField } from '../../../../../model/hooks';

import s from './PromoField.module.scss';

export const PromoField = () => {
  const t = useTranslations('plus.checkout.promo');
  const { id, hintId, isShown, isInvalid, message, field } = usePromoField();

  if (!isShown) {
    return null;
  }

  return (
    <div className={s.root}>
      <label className={s.label} htmlFor={id}>
        {t('label')}
      </label>
      <Input
        aria-describedby={hintId}
        aria-invalid={isInvalid}
        autoComplete='off'
        id={id}
        isInvalid={isInvalid}
        maxLength={PROMO_CODE.maxLength}
        placeholder={t('placeholder')}
        spellCheck={false}
        {...field}
      />
      <p className={s.hint} data-invalid={isInvalid} id={hintId} role={isInvalid ? 'alert' : undefined}>
        {message}
      </p>
    </div>
  );
};
