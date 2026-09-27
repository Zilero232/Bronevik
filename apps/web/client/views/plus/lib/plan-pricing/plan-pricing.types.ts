import type { PlanOffer } from '@otmetki/schemas';

export type PlanPricing = PlanOffer & {
  perMonthRub: number;
  savingRub: number;
  savingPercent: number;
};
