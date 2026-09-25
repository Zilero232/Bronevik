'use client';

import { PROMO_CODE } from '@bronevik/schemas';
import { TicketPercent } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Input } from '@/ui-kit';

import type { PromoFieldProps } from './PromoField.types';

import s from './PromoField.module.scss';

export const PromoField = ({ registration, error }: PromoFieldProps) => {
  const t = useTranslations('plus.checkout.promo');
  const id = useId();

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
        icon={<TicketPercent size={16} />}
        id={id}
        isInvalid={Boolean(error)}
        maxLength={PROMO_CODE.maxLength}
        placeholder={t('placeholder')}
        spellCheck={false}
        {...registration}
      />
      <p className={s.hint} data-invalid={Boolean(error)} id={`${id}-hint`} role={error ? 'alert' : undefined}>
        {message ?? t('hint')}
      </p>
    </div>
  );
};
