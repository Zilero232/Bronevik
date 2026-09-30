'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';

import type { UsePlanCardInput } from './use-plan-card.types';

import { PLUS_CHECKOUT } from '../../../config';

export const usePlanCard = ({ pricing, recommended }: UsePlanCardInput) => {
  const t = useTranslations('plus.checkout.plan');
  const format = useFormatter();
  const { register, control } = useFormContext<CheckoutInput>();
  const selected = useWatch({ control, name: 'plan' });

  const { plan, months, priceRub, perMonthRub, savingRub, savingPercent } = pricing;
  const hasSaving = savingRub > 0;

  return {
    plan,
    isSelected: selected === plan,
    isRecommended: plan === recommended,
    field: register('plan'),
    perMonth: format.number(perMonthRub, PLUS_CHECKOUT.priceFormat),
    total: t('total', { price: format.number(priceRub, PLUS_CHECKOUT.priceFormat), months }),
    saving: hasSaving
      ? {
          badge: t('savingBadge', { percent: format.number(savingPercent / 100, 'share') }),
          amount: t('savingAmount', { amount: format.number(savingRub, PLUS_CHECKOUT.priceFormat) })
        }
      : null
  };
};
