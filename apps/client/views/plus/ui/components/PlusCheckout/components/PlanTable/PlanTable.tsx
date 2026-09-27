'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { match } from 'ts-pattern';

import { Badge, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { PLUS_CHECKOUT } from '../../../../../config';
import { usePlusOffers } from '../../../../../model/hooks';

import s from './PlanTable.module.scss';

export const PlanTable = () => {
  const t = useTranslations('plus.checkout');
  const format = useFormatter();
  const { register } = useFormContext<CheckoutInput>();
  const { pricing, recommended, isPending, isError, isRetrying, retry } = usePlusOffers();

  return match({ isPending, isError, isEmpty: pricing.length === 0 })
    .with({ isPending: true }, () => <Skeleton height={180} shape='block' />)
    .with({ isError: true }, () => <ErrorState isRetrying={isRetrying} onRetry={retry} />)
    .with({ isEmpty: true }, () => <EmptyState title={t('unavailable')} />)
    .otherwise(() => (
      <fieldset className={s.root}>
        <legend className={s.caption}>{t('planLabel')}</legend>
        <div className={s.grid}>
          {pricing.map(({ plan, priceRub, perMonthRub, savingRub, savingPercent }) => (
            <label key={plan} className={s.plan} data-recommended={plan === recommended}>
              {plan === recommended && (
                <Badge shape='corner' tone='accent'>
                  {t('recommended')}
                </Badge>
              )}
              <span className={s.head}>
                <input className={s.radio} type='radio' value={plan} {...register('plan')} />
                <span className={s.name}>{t(`plans.${plan}`)}</span>
              </span>
              <span className={s.price}>{format.number(priceRub, PLUS_CHECKOUT.priceFormat)}</span>
              <span className={s.row}>
                <span className={s.rowLabel}>{t('columns.perMonth')}</span>
                <span className={s.rowValue}>{format.number(perMonthRub, PLUS_CHECKOUT.priceFormat)}</span>
              </span>
              <span className={s.row}>
                <span className={s.rowLabel}>{t('columns.saving')}</span>
                <span className={s.rowValue} data-saving={savingRub > 0}>
                  {savingRub > 0 ? t('savingValue', { amount: format.number(savingRub, PLUS_CHECKOUT.priceFormat), percent: savingPercent }) : '—'}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    ));
};
