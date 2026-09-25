'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlusPlans } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

import { PLUS_CHECKOUT } from '../../config';
import { planPricing } from '../../lib/plan-pricing';

export const usePlusOffers = () => {
  const { data: offers, isPending } = useQuery({ queryKey: QUERY_KEYS.billing.plans, queryFn: getPlusPlans, staleTime: PLUS_CHECKOUT.plansStaleMs });

  return { pricing: planPricing(offers ?? []), isPending };
};
