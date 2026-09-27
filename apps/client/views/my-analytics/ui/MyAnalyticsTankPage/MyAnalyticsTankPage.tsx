'use client';

import type { MyAnalyticsTankPageProps } from './MyAnalyticsTankPage.types';

import { AnalyticsFiltersProvider, TankTrend } from '../components';

export const MyAnalyticsTankPage = ({ tankId }: MyAnalyticsTankPageProps) => (
  <AnalyticsFiltersProvider>
    <TankTrend tankId={tankId} />
  </AnalyticsFiltersProvider>
);
