'use client';

import type { InsightsPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PROFILE_PERIODS } from '../../../config';
import { usePlayerInsights } from '../use-profile-queries';

export const useInsightsTab = () => {
  const tPeriods = useTranslations('periods');

  const [period, setPeriod] = useState<InsightsPeriod>('overall');

  const query = usePlayerInsights(period);

  return {
    period,
    setPeriod,
    periodOptions: PROFILE_PERIODS.map((value) => ({ value, label: tPeriods(value) })),
    query
  };
};
