'use client';

import type { AnalyticsPeriod } from '@otmetki/schemas';

import { useState } from 'react';

import type { AnalyticsFiltersValue } from '../../context';

import { ANALYTICS_VIEW } from '../../../config';

export const useAnalyticsFiltersState = (): AnalyticsFiltersValue => {
  const [period, setPeriod] = useState<AnalyticsPeriod>(ANALYTICS_VIEW.defaultPeriod);
  const [account, setAccount] = useState<number | undefined>(undefined);

  return { period, account, setPeriod, setAccount };
};
