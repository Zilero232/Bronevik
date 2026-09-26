'use client';

import { useQuery } from '@tanstack/react-query';

import { listMaps } from '@/entities/map/map';
import { listVehicles, vehicleIndex } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseGuideSubjectInput } from './use-guide-subject.types';

import { GUIDE_SUBJECT } from '../../../config';

export const useGuideSubject = ({ tankId, arenaId }: UseGuideSubjectInput) => {
  const { data: catalog } = useQuery({
    queryKey: QUERY_KEYS.tanks.catalog,
    queryFn: ({ signal }) => listVehicles({ signal }),
    staleTime: GUIDE_SUBJECT.catalogStaleMs,
    enabled: tankId !== null
  });

  const { data: maps } = useQuery({
    queryKey: QUERY_KEYS.maps.list,
    queryFn: ({ signal }) => listMaps({ signal }),
    staleTime: GUIDE_SUBJECT.mapsStaleMs,
    enabled: arenaId !== null
  });

  return {
    vehicle: tankId === null ? null : (vehicleIndex(catalog)[tankId] ?? null),
    map: arenaId === null ? null : (maps?.find((candidate) => candidate.arenaId === arenaId) ?? null)
  };
};
