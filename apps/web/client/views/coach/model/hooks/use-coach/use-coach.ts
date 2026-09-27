'use client';

import { useQuery } from '@tanstack/react-query';

import { coachQueries } from '@/entities/coaching/coach';
import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';

import { coachContactLinks } from '../../../lib/coach-contacts';

export const useCoach = (userId: string) => {
  const { data: catalog } = useVehicleCatalog();

  return useQuery({
    ...coachQueries.detail(userId),
    select: (coach) => ({
      coach,
      vehicles: pickVehicles({ tankIds: coach.tankIds, catalog }),
      contacts: coachContactLinks(coach.contacts),
      offers: coach.offers.filter(({ isActive }) => isActive),
      profileHref: ROUTES.players.profile(String(coach.accountId))
    })
  });
};
