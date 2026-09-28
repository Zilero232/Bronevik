'use client';

import { useQuery } from '@tanstack/react-query';

import { plusQueries } from '../../../api';
import { cheapestMonthly, planPricing, recommendedPlan } from '../../../lib/plan-pricing';

export const usePlusOffers = () => {
  const query = useQuery({ ...plusQueries.plans(), select: planPricing });

  const pricing = query.data ?? [];

  return { query, recommended: recommendedPlan(pricing), fromMonthlyRub: cheapestMonthly(pricing) };
};
