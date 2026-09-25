import type { PlanPricing } from '../../../../../lib/plan-pricing';

export type PlanPriceProps = {
  pricing: PlanPricing | null;
  isPending: boolean;
};
