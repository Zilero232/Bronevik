import type { PlanPricing } from '../../../lib/plan-pricing';

export type UsePlanCardInput = {
  pricing: PlanPricing;
  recommended: PlanPricing['plan'] | null;
};
