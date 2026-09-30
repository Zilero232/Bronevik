'use client';

import { Check } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { MOTION_TRANSITION } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { PlanCardProps } from './PlanCard.types';

import { PLUS_CHECKOUT } from '../../../../../config';
import { usePlanCard } from '../../../../../model/hooks';

import s from './PlanCard.module.scss';

export const PlanCard = ({ pricing, recommended }: PlanCardProps) => {
  const t = useTranslations('plus.checkout');
  const { plan, isSelected, isRecommended, field, perMonth, total, saving } = usePlanCard({ pricing, recommended });

  return (
    <label className={s.root} data-recommended={isRecommended} data-selected={isSelected}>
      {isSelected && <m.span aria-hidden className={s.frame} layoutId={PLUS_CHECKOUT.selectionLayoutId} transition={MOTION_TRANSITION.layout} />}
      {isRecommended && (
        <Badge className={s.flag} shape='plate' tone='gold'>
          {t('recommended')}
        </Badge>
      )}
      <span className={s.head}>
        <input className={s.radio} type='radio' value={plan} {...field} />
        <span aria-hidden className={s.indicator}>
          <Check size={12} strokeWidth={3} />
        </span>
        <span className={s.name}>{t(`plans.${plan}`)}</span>
      </span>
      <span className={s.price}>
        <span className={s.amount}>{perMonth}</span>
        <span className={s.unit}>{t('plan.perMonth')}</span>
      </span>
      <span className={s.total}>{total}</span>
      <span className={s.saving}>
        {saving ? (
          <>
            <Badge className={s.percent} shape='plate' tone='gold'>
              {saving.badge}
            </Badge>
            <span className={s.amountSaved}>{saving.amount}</span>
          </>
        ) : (
          <span className={s.base}>{t('plan.basePrice')}</span>
        )}
      </span>
    </label>
  );
};
