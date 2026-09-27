'use client';

import type { RatingPeriod } from '@otmetki/schemas';

import { useQueryState } from 'nuqs';
import { useState } from 'react';

import { COMPARE_LIMIT, COMPARE_PARAMS } from '../../../config';
import { compareIds } from '../../../lib/compare-math';

export const useCompareState = () => {
  const [raw, setIds] = useQueryState('ids', COMPARE_PARAMS.ids);
  const [period, setPeriod] = useState<RatingPeriod>('overall');

  const ids = compareIds(raw);
  const replace = (next: number[]) => void setIds(next.length > 0 ? next : null);

  return {
    ids,
    period,
    setPeriod,
    canAdd: ids.length < COMPARE_LIMIT.max,
    add: (id: number) => replace([...ids.filter((current) => current !== id), id].slice(0, COMPARE_LIMIT.max)),
    remove: (id: number) => replace(ids.filter((current) => current !== id))
  };
};
