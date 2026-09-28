'use client';

import type { QueryFunctionContext } from '@tanstack/react-query';

import { useQueries, useQuery } from '@tanstack/react-query';
import { unique } from 'remeda';

import { useCommunityViewer } from '@/entities/auth/session';
import { getCoach, getCoachingOrders } from '@/entities/coaching/coach';
import { QUERY_KEYS } from '@/shared/constants';

export const useCoachingOrders = () => {
  const { userId, isSignedIn } = useCommunityViewer();
  const query = useQuery({
    queryKey: QUERY_KEYS.coaching.orders,
    queryFn: getCoachingOrders,
    enabled: isSignedIn
  });

  const coachIds = unique((query.data ?? []).map(({ coachUserId }) => coachUserId).filter((id) => id !== userId));
  const coaches = useQueries({
    queries: coachIds.map((coachUserId) => ({
      queryKey: QUERY_KEYS.coaching.coach(coachUserId),
      queryFn: ({ signal }: QueryFunctionContext) => getCoach({ userId: coachUserId, signal })
    }))
  });

  const names = new Map(coaches.flatMap(({ data: coach }) => (coach ? [[coach.userId, coach.name] as const] : [])));

  return {
    isSignedIn,
    query,
    coachName: (coachUserId: string) => names.get(coachUserId) ?? null
  };
};
