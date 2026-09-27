'use client';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { TANK_PAGE } from '../../../config';
import { similarTanks } from '../../../lib/similar-tanks';
import { useTank } from '../../context';

export const useSimilarTanks = () => {
  const { detail } = useTank();
  const { data } = useVehicleCatalog();

  return similarTanks({ catalog: data ?? [], vehicle: detail.vehicle, limit: TANK_PAGE.similarLimit });
};
