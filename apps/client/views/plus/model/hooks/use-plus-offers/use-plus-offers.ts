'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlusPlans } from '@/entities/plus/subscription';
import { QUERY_KEYS } from '@/shared/constants';

import { PLUS_CHECKOUT } from '../../../config';
import { cheapestMonthly, planPricing, recommendedPlan } from '../../../lib/plan-pricing';

export const usePlusOffers = () => {
  const {
    data: offers,
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({ queryKey: QUERY_KEYS.billing.plans, queryFn: getPlusPlans, staleTime: PLUS_CHECKOUT.plansStaleMs });

  const pricing = planPricing(offers ?? []);

  return {
    pricing,
    recommended: recommendedPlan(pricing),
    fromMonthlyRub: cheapestMonthly(pricing),
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
