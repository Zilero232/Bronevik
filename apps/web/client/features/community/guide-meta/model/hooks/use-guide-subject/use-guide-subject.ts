'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { mapQueries } from '@/entities/map/map';
import { vehicleCatalogQuery, vehicleIndex } from '@/entities/tank/tank';

import type { UseGuideSubjectInput } from './use-guide-subject.types';

export const useGuideSubject = ({ tankId, arenaId }: UseGuideSubjectInput) => {
  const locale = useLocale();
  const { data: catalog } = useQuery({ ...vehicleCatalogQuery(), enabled: tankId !== null });
  const { data: maps } = useQuery({ ...mapQueries.localizedList(locale), enabled: arenaId !== null });

  return {
    vehicle: tankId === null ? null : (vehicleIndex(catalog)[tankId] ?? null),
    map: arenaId === null ? null : (maps?.find((candidate) => candidate.arenaId === arenaId) ?? null)
  };
};
