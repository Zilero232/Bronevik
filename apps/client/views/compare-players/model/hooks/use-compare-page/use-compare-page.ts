'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';

import type { CompareStatus } from './use-compare-page.types';

import { COMPARE_LIMIT, COMPARE_PERIODS } from '../../../config';
import { useCompareState } from '../use-compare-state';
import { useComparison } from '../use-comparison';

export const useComparePage = () => {
  const t = useTranslations('compare');
  const tPeriods = useTranslations('periods');
  const { ids, period, setPeriod, canAdd, add, remove } = useCompareState();
  const { data: comparison, isPending, error, isRefetching, refetch } = useComparison(ids);

  const isMissing = isNotFoundError(error) || (comparison !== undefined && comparison.players.length < COMPARE_LIMIT.min);

  const status = match({ isReady: ids.length >= COMPARE_LIMIT.min, isMissing, hasData: comparison !== undefined, isError: error !== null })
    .returnType<CompareStatus>()
    .with({ isReady: false }, () => 'idle')
    .with({ isMissing: true }, () => 'missing')
    .with({ hasData: true }, () => 'ready')
    .with({ isError: true }, () => 'error')
    .otherwise(() => 'loading');

  return {
    ids,
    period,
    setPeriod,
    periodOptions: COMPARE_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) })),
    canAdd,
    add,
    remove,
    comparison,
    status,
    isLoading: isPending,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
