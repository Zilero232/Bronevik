'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useState } from 'react';

import { usePlus } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { AnalyticsTab } from '../../../config';

import { ANALYTICS_TABS } from '../../../config';

export const useMyAnalyticsPage = () => {
  const router = useRouter();
  const { isPlus, isPending } = usePlus();
  const [tab, setTab] = useState<AnalyticsTab>(ANALYTICS_TABS[0].value);

  return {
    tab,
    tabs: ANALYTICS_TABS.map(({ value, feature }) => ({ value, isLocked: feature !== null && !isPending && !isPlus })),
    isPeriodVisible: ANALYTICS_TABS.some((item) => item.value === tab && item.hasPeriod),
    setTab,
    openTank: (vehicle: VehicleSummary | null) => {
      if (vehicle) {
        router.push(ROUTES.account.analyticsTank(vehicle.tankId));
      }
    }
  };
};
