'use client';

import type { QueryFunctionContext } from '@tanstack/react-query';

import { useQueries, useQuery } from '@tanstack/react-query';
import { unique } from 'remeda';

import { getCoach, getCoachingOrders } from '@/entities/coaching/coach';
import { useCommunityViewer } from '@/features/community/viewer';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { COACHING_ORDERS } from '../../../config';

export const useCoachingOrders = () => {
  const { userId, isSignedIn } = useCommunityViewer();
  const query = useQuery({
    queryKey: QUERY_KEYS.coaching.orders,
    queryFn: getCoachingOrders,
    enabled: isSignedIn,
    retry: (failures, failure) => !isNotFoundError(failure) && failures < COACHING_ORDERS.retries
  });

  const coachIds = unique((query.data ?? []).map(({ coachUserId }) => coachUserId).filter((id) => id !== userId));
  const coaches = useQueries({
    queries: coachIds.map((coachUserId) => ({
      queryKey: QUERY_KEYS.coaching.coach(coachUserId),
      queryFn: ({ signal }: QueryFunctionContext) => getCoach({ userId: coachUserId, signal }),
      retry: (failures: number, failure: Error) => !isNotFoundError(failure) && failures < COACHING_ORDERS.retries
    }))
  });

  const names = new Map(coaches.flatMap(({ data: coach }) => (coach ? [[coach.userId, coach.name] as const] : [])));

  return {
    isSignedIn,
    query,
    coachName: (coachUserId: string) => names.get(coachUserId) ?? null
  };
};
