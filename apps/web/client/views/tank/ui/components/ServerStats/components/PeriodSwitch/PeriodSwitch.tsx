'use client';

import type { ServerPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import { usePeriodSwitch } from '../../../../../model/hooks';

export const PeriodSwitch = () => {
  const t = useTranslations('tank.stats');
  const { period, options, onChange } = usePeriodSwitch();

  return <SegmentedControl<ServerPeriod> aria-label={t('periodLabel')} options={options} size='sm' value={period} onChange={onChange} />;
};
