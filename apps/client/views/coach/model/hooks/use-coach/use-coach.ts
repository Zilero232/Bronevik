'use client';

import { useQuery } from '@tanstack/react-query';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { getCoach } from '@/entities/coaching/coach';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { coachContactLinks } from '../../../lib/coach-contacts';

export const useCoach = (userId: string) => {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.coaching.coach(userId),
    queryFn: ({ signal }) => getCoach({ userId, signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < 2
  });

  const { data: catalog } = useVehicleCatalog();

  return {
    coach: data ?? null,
    vehicles: data ? pickVehicles({ tankIds: data.tankIds, catalog }) : [],
    contacts: data ? coachContactLinks(data.contacts) : [],
    offers: data?.offers.filter(({ isActive }) => isActive) ?? [],
    profileHref: data ? ROUTES.players.profile(String(data.accountId)) : null,
    isPending,
    isError,
    isNotFound: isNotFoundError(error),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
