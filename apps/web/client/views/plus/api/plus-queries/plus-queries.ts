import { queryOptions } from '@tanstack/react-query';

import { getPlusPlans } from '@/entities/plus/subscription';
import { QUERY_KEYS } from '@/shared/constants';

import { PLUS_CHECKOUT } from '../../config';

export const plusQueries = {
  plans: () => queryOptions({ queryKey: QUERY_KEYS.billing.plans, queryFn: getPlusPlans, staleTime: PLUS_CHECKOUT.plansStaleMs })
};
