'use client';

import type { ServerPeriod } from '@otmetki/schemas';

import { serverPeriodSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { useTankPeriod } from '../use-tank-period';

export const usePeriodSwitch = () => {
  const t = useTranslations('periods');
  const [period, setPeriod] = useTankPeriod();

  return {
    period,
    options: serverPeriodSchema.options.map((value) => ({ value, label: t(value) })),
    onChange: (value: ServerPeriod) => void setPeriod(value)
  };
};
