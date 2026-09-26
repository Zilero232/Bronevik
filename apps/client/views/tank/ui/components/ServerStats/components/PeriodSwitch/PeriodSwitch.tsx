'use client';

import type { ServerPeriod } from '@otmetki/schemas';

import { serverPeriodSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import { useTankPeriod } from '../../../../../model/hooks';

export const PeriodSwitch = () => {
  const t = useTranslations('tank.stats');
  const [period, setPeriod] = useTankPeriod();

  const options = serverPeriodSchema.options.map((value) => ({ value, label: t(`periods.${value}`) }));

  const onChange = (value: ServerPeriod) => {
    void setPeriod(value);
  };

  return <SegmentedControl<ServerPeriod> aria-label={t('periodLabel')} options={options} size='sm' value={period} onChange={onChange} />;
};
