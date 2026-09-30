'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { PLUS_CHECKOUT } from '../../../../../config';
import { usePlusOffers } from '../../../../../model/hooks';
import { PlanCard } from '../PlanCard';

import s from './PlanPicker.module.scss';

export const PlanPicker = () => {
  const t = useTranslations('plus.checkout');
  const { query, recommended } = usePlusOffers();

  return (
    <QueryState
      skeleton={
        <div className={s.grid}>
          <Skeleton className={s.skeleton} count={PLUS_CHECKOUT.planSkeletonCount} shape='block' />
        </div>
      }
      empty={<EmptyState title={t('unavailable')} />}
      query={query}
    >
      {(pricing) => (
        <fieldset className={s.root}>
          <legend className={s.legend}>{t('planLabel')}</legend>
          <div className={s.grid}>
            {pricing.map((item) => (
              <PlanCard key={item.plan} pricing={item} recommended={recommended} />
            ))}
          </div>
        </fieldset>
      )}
    </QueryState>
  );
};
