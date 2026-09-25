import type { PLUS_PLANS } from '../../config';

export type PlusPlan = keyof typeof PLUS_PLANS;

export type PlanPriceInput = {
  plan: PlusPlan;
  discountPercent: number | null;
};

export type DescribePlanInput = {
  plan: PlusPlan;
  isRenewal: boolean;
};
