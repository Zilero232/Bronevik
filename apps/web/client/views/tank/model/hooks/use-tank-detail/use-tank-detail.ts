'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { useRouteParam } from '@/shared/lib';

import { tankQueries } from '../../../api';
import { isSameTank } from '../../../lib';
import { useTankPeriod } from '../use-tank-period';

const MAX_RETRIES = 2;

export const useTankDetail = () => {
  const slug = useRouteParam('slug');
  const [period] = useTankPeriod();

  return useQuery({
    ...tankQueries.detail({ idOrSlug: slug, period }),
    placeholderData: (previous) => (previous && isSameTank({ detail: previous, idOrSlug: slug }) ? previous : undefined),
    retry: (count, error) => !isNotFoundError(error) && count < MAX_RETRIES
  });
};
