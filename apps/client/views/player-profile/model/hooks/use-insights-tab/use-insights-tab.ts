'use client';

import type { InsightsPeriod } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PROFILE_PERIODS } from '../../../config';
import { hasInsights } from '../../../lib/has-insights';
import { usePlayerInsights } from '../use-profile-queries';

export const useInsightsTab = () => {
  const t = useTranslations('profile');
  const tPeriods = useTranslations('periods');

  const [period, setPeriod] = useState<InsightsPeriod>('overall');

  const { data: insights, isPending, isError, isRefetching, refetch } = usePlayerInsights(period);

  return {
    period,
    setPeriod,
    periodOptions: PROFILE_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) })),
    insights: insights && hasInsights(insights) ? insights : null,
    isEmpty: insights !== undefined && !hasInsights(insights),
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
