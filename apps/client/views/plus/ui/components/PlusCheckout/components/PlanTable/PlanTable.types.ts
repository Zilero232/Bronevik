import type { UseFormRegisterReturn } from 'react-hook-form';

import type { PlanPricing } from '../../../../../lib/plan-pricing';

export type PlanTableProps = {
  pricing: PlanPricing[];
  registration: UseFormRegisterReturn<'plan'>;
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
};
