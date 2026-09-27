'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlusPlans } from '@/entities/plus/subscription';
import { QUERY_KEYS } from '@/shared/constants';

import { PLUS_CHECKOUT } from '../../../config';
import { cheapestMonthly, planPricing, recommendedPlan } from '../../../lib/plan-pricing';

export const usePlusOffers = () => {
  const query = useQuery({ queryKey: QUERY_KEYS.billing.plans, queryFn: getPlusPlans, staleTime: PLUS_CHECKOUT.plansStaleMs, select: planPricing });

  const pricing = query.data ?? [];

  return { query, recommended: recommendedPlan(pricing), fromMonthlyRub: cheapestMonthly(pricing) };
};
