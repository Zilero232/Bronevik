import type { Plans } from '@otmetki/schemas';

import { firstBy, round } from 'remeda';

import type { PlanPricing } from './plan-pricing.types';

export const planPricing = (offers: Plans): PlanPricing[] => {
  const baseline = firstBy(offers, (offer) => offer.months);

  if (!baseline) {
    return [];
  }

  const baseMonthlyRub = baseline.priceRub / baseline.months;

  return offers.map((offer) => {
    const fullRub = baseMonthlyRub * offer.months;
    const savingRub = Math.max(0, round(fullRub - offer.priceRub, 2));

    return {
      ...offer,
      perMonthRub: round(offer.priceRub / offer.months, 2),
      savingRub,
      savingPercent: fullRub > 0 ? Math.round((savingRub / fullRub) * 100) : 0
    };
  });
};

export const recommendedPlan = (pricing: readonly PlanPricing[]): PlanPricing['plan'] | null => {
  const best = firstBy(pricing, [(item) => item.savingPercent, 'desc']);

  return best && best.savingPercent > 0 ? best.plan : null;
};

export const cheapestMonthly = (pricing: readonly PlanPricing[]): number | null => firstBy(pricing, (item) => item.perMonthRub)?.perMonthRub ?? null;
