'use client';

import { useTranslations } from 'next-intl';

import { isNotFoundError } from '@/shared/api/source';

import { COMPARE_LIMIT, COMPARE_PERIODS } from '../../../config';
import { useCompareState } from '../use-compare-state';
import { useComparison } from '../use-comparison';

export const useComparePage = () => {
  const tPeriods = useTranslations('periods');
  const { ids, period, setPeriod, canAdd, add, remove } = useCompareState();
  const query = useComparison(ids);

  return {
    ids,
    period,
    setPeriod,
    periodOptions: COMPARE_PERIODS.map((value) => ({ value, label: tPeriods(value) })),
    canAdd,
    add,
    remove,
    query,
    isIdle: ids.length < COMPARE_LIMIT.min,
    isMissing: isNotFoundError(query.error) || (query.data !== undefined && query.data.players.length < COMPARE_LIMIT.min)
  };
};
