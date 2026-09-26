'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { getTank } from '@/entities/tank/tank';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { isSameTank } from '../../../lib';
import { useTankPeriod } from '../use-tank-period';

const MAX_RETRIES = 2;

export const useTankDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [period] = useTankPeriod();

  return useQuery({
    queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug, period }),
    queryFn: ({ signal }) => getTank({ idOrSlug: slug, period, signal }),
    placeholderData: (previous) => (previous && isSameTank({ detail: previous, idOrSlug: slug }) ? previous : undefined),
    retry: (count, error) => !isNotFoundError(error) && count < MAX_RETRIES
  });
};
