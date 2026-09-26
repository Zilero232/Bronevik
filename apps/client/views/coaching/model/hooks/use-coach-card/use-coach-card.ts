'use client';

import type { Coach } from '@/shared/api/coaching';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { ROUTES } from '@/shared/constants';

import { COACHING_LIST } from '../../../config';

export const useCoachCard = (coach: Coach) => {
  const { data: catalog } = useVehicleCatalog();
  const vehicles = pickVehicles({ tankIds: coach.tankIds, catalog });

  return {
    href: ROUTES.coach(coach.userId),
    vehicles: vehicles.slice(0, COACHING_LIST.previewTanks),
    moreTanks: Math.max(0, vehicles.length - COACHING_LIST.previewTanks),
    activeOffers: coach.offers.filter(({ isActive }) => isActive).length
  };
};
