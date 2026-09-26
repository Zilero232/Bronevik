'use client';

import type { AnalyticsBreakdown } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { BreakdownDimension } from './use-breakdown-panel.types';

import { ANALYTICS_VIEW } from '../../../config';
import { useBreakdownColumns } from '../use-breakdown-columns';

export const useBreakdownPanel = (breakdown: AnalyticsBreakdown) => {
  const t = useTranslations('analytics.overview.breakdown');
  const [dimension, setDimension] = useState<BreakdownDimension>(ANALYTICS_VIEW.breakdownDimensions[0]);
  const columns = useBreakdownColumns(dimension);

  return {
    dimension,
    options: ANALYTICS_VIEW.breakdownDimensions.map((value) => ({ value, label: t(`dimensions.${value}`) })),
    rows: breakdown[dimension],
    columns,
    setDimension
  };
};
