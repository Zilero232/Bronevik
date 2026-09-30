import type { PlanPricing } from '../../../../../lib/plan-pricing';

export type PlanCardProps = {
  pricing: PlanPricing;
  recommended: PlanPricing['plan'] | null;
};
