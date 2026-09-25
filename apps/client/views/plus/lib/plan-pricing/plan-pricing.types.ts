import type { PlanOffer } from '@bronevik/schemas';

export type PlanPricing = PlanOffer & {
  perMonthRub: number;
  savingRub: number;
  savingPercent: number;
};
