'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import { unique } from 'remeda';

import { useCommunityViewer } from '@/features/community/viewer';
import { getCoach, getCoachingOrders } from '@/shared/api/coaching';
import { QUERY_KEYS } from '@/shared/constants';

export const useCoachingOrders = () => {
  const { userId, isSignedIn } = useCommunityViewer();
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.coaching.orders,
    queryFn: getCoachingOrders,
    enabled: isSignedIn
  });

  const coachIds = unique((data ?? []).map(({ coachUserId }) => coachUserId).filter((id) => id !== userId));
  const coaches = useQueries({
    queries: coachIds.map((coachUserId) => ({
      queryKey: QUERY_KEYS.coaching.coach(coachUserId),
      queryFn: ({ signal }: { signal: AbortSignal }) => getCoach({ userId: coachUserId, signal })
    }))
  });

  const names = new Map(coaches.flatMap(({ data: coach }) => (coach ? [[coach.userId, coach.name] as const] : [])));

  return {
    isSignedIn,
    orders: data ?? [],
    isPending: isSignedIn && isPending,
    isError,
    isRetrying: isFetching,
    coachName: (coachUserId: string) => names.get(coachUserId) ?? null,
    retry: () => void refetch()
  };
};
