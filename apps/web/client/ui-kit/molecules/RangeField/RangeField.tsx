'use client';

import { NumberField } from '@base-ui/react/number-field';
import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import { useFormControl } from '@/shared/lib';

import type { RangeFieldProps } from './RangeField.types';

import s from './RangeField.module.scss';

export const RangeField = ({
  from,
  to,
  min,
  max,
  step = 1,
  suffix,
  fromPlaceholder,
  toPlaceholder,
  className,
  'aria-label': ariaLabel,
  onFromChange,
  onToChange
}: RangeFieldProps) => {
  const t = useTranslations('common.filters');
  const locale = useLocale();
  const control = useFormControl();

  return (
    <div aria-label={ariaLabel} className={clsx(s.root, className)} role='group'>
      <NumberField.Root className={s.side} locale={locale} max={max} min={min} step={step} value={from} onValueChange={onFromChange}>
        <NumberField.Input
          aria-describedby={control['aria-describedby']}
          aria-label={t('rangeFrom', { label: ariaLabel })}
          className={s.input}
          id={control.id}
          placeholder={fromPlaceholder ?? t('from')}
        />
      </NumberField.Root>
      <span aria-hidden className={s.dash} />
      <NumberField.Root className={s.side} locale={locale} max={max} min={min} step={step} value={to} onValueChange={onToChange}>
        <NumberField.Input aria-label={t('rangeTo', { label: ariaLabel })} className={s.input} placeholder={toPlaceholder ?? t('to')} />
      </NumberField.Root>
      {suffix && <span className={s.suffix}>{suffix}</span>}
    </div>
  );
};
