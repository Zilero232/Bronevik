'use client';

import type { Goal } from '@otmetki/schemas';

import { differenceInCalendarDays } from 'date-fns';
import { useFormatter } from 'next-intl';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { percentText, useClientNow } from '@/shared/lib';

import { isPercentMetric } from '../../../lib/goal-form';
import { goalProgress } from '../../../lib/goal-progress';

export const useGoalItem = ({ metric, tankId, target, baseline, current, endsAt }: Goal) => {
  const format = useFormatter();
  const now = useClientNow();
  const { data: catalog } = useVehicleCatalog();

  return {
    progress: goalProgress({ baseline, target, current }),
    tankName: tankId === null ? null : (vehicleIndex(catalog)[tankId]?.name ?? null),
    daysLeft: now ? differenceInCalendarDays(new Date(endsAt), now) : null,
    formatValue: (number: number) =>
      isPercentMetric(metric) ? percentText({ format, value: number, digits: 2 }) : format.number(number, { maximumFractionDigits: 2 })
  };
};
