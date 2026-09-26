'use client';

import type { RatingPeriod } from '@bronevik/schemas';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { COMPARE_LIMIT } from '../../../config';
import { parseCompareIds } from '../../../lib/compare-math';

export const useCompareState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<RatingPeriod>('overall');

  const ids = parseCompareIds(searchParams.get('ids'));

  const replace = (next: number[]) =>
    router.replace({ pathname: ROUTES.comparePlayers, query: next.length > 0 ? { ids: next.join(',') } : {} }, { scroll: false });

  return {
    ids,
    period,
    setPeriod,
    canAdd: ids.length < COMPARE_LIMIT.max,
    add: (id: number) => replace([...ids.filter((current) => current !== id), id].slice(0, COMPARE_LIMIT.max)),
    remove: (id: number) => replace(ids.filter((current) => current !== id))
  };
};
