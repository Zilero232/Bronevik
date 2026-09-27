'use client';

import { useQuery } from '@tanstack/react-query';

import { buildQueries } from '../../../api';
import { useBuildContext } from '../../context';

export const usePresetStrip = () => {
  const { vehicle } = useBuildContext();

  return useQuery(buildQueries.popular(vehicle.tankId));
};
