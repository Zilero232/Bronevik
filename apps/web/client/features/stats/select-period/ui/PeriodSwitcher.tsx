'use client';

import type { RecentPeriod } from '@otmetki/schemas';

import { recentPeriodSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { PeriodSwitcherProps } from './PeriodSwitcher.types';

export const PeriodSwitcher = ({ value, size = 'md', className, onChange }: PeriodSwitcherProps) => {
  const t = useTranslations('periods');

  return (
    <SegmentedControl<RecentPeriod>
      aria-label={t('label')}
      className={className}
      options={recentPeriodSchema.options.map((period) => ({ value: period, label: t(period) }))}
      size={size}
      value={value}
      onChange={onChange}
    />
  );
};
