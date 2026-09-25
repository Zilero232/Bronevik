'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { AnimatedNumber, Skeleton } from '@/ui-kit';

import type { PlanPriceProps } from './PlanPrice.types';

import { PLUS_CHECKOUT } from '../../../../../config';

import s from './PlanPrice.module.scss';

export const PlanPrice = ({ pricing, isPending }: PlanPriceProps) => {
  const t = useTranslations('plus.checkout.price');
  const format = useFormatter();

  if (isPending || !pricing) {
    return <Skeleton height={112} shape='block' />;
  }

  const { months, priceRub, perMonthRub, savingRub, savingPercent } = pricing;

  return (
    <div className={s.root}>
      <div className={s.main}>
        <AnimatedNumber className={s.value} duration={0.6} format={PLUS_CHECKOUT.priceFormat} value={perMonthRub} />
        <span className={s.unit}>{t('perMonth')}</span>
      </div>
      <dl className={s.facts}>
        <div className={s.fact}>
          <dt className={s.label}>{t('total')}</dt>
          <dd className={s.figure}>{t('totalValue', { price: format.number(priceRub, PLUS_CHECKOUT.priceFormat), months })}</dd>
        </div>
        {savingRub > 0 && (
          <div className={s.fact} data-tone='gold'>
            <dt className={s.label}>{t('saving')}</dt>
            <dd className={s.figure}>{t('savingValue', { amount: format.number(savingRub, PLUS_CHECKOUT.priceFormat), percent: savingPercent })}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
