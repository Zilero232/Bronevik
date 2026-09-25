'use client';

import type { TankDetail } from '@bronevik/schemas';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { isNotFoundError } from '@/shared/api/source';
import { getTank } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { useTankPeriod } from './use-tank-period';

const MAX_RETRIES = 2;

const isSameTank = (detail: TankDetail, idOrSlug: string) => detail.vehicle.slug === idOrSlug || String(detail.vehicle.tankId) === idOrSlug;

export const useTankDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [period] = useTankPeriod();

  return useQuery({
    queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug, period }),
    queryFn: ({ signal }) => getTank({ idOrSlug: slug, period, signal }),
    placeholderData: (previous) => (previous && isSameTank(previous, slug) ? previous : undefined),
    retry: (count, error) => !isNotFoundError(error) && count < MAX_RETRIES
  });
};
