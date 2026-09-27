'use client';

import type { Goal } from '@otmetki/schemas';

import { differenceInCalendarDays } from 'date-fns';
import { useFormatter } from 'next-intl';

import { percentText, useClientNow } from '@/shared/lib';

import { isPercentMetric } from '../../../lib/goal-form';
import { goalProgress } from '../../../lib/goal-progress';

export const useGoalItem = ({ metric, target, baseline, current, endsAt }: Goal) => {
  const format = useFormatter();
  const now = useClientNow();

  return {
    progress: goalProgress({ baseline, target, current }),
    daysLeft: now ? differenceInCalendarDays(new Date(endsAt), now) : null,
    formatValue: (number: number) =>
      isPercentMetric(metric) ? percentText({ format, value: number, digits: 2 }) : format.number(number, { maximumFractionDigits: 2 })
  };
};
