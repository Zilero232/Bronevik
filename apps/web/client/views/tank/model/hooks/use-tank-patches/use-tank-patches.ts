'use client';

import { useQuery } from '@tanstack/react-query';

import { getTankPatches } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { patchEntries } from '../../../lib';
import { useTank } from '../../context';

export const useTankPatches = () => {
  const { tankId } = useTank();

  return useQuery({
    queryKey: QUERY_KEYS.tanks.patches(tankId),
    queryFn: ({ signal }) => getTankPatches({ tankId, signal }),
    select: ({ patches }) => patchEntries(patches)
  });
};
