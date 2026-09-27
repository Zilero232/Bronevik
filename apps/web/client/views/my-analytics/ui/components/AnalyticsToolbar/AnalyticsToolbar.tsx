'use client';

import type { AnalyticsPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { SegmentedControl, Select } from '@/ui-kit';

import type { AnalyticsToolbarProps } from './AnalyticsToolbar.types';

import { useAnalyticsToolbar } from '../../../model/hooks';

import s from './AnalyticsToolbar.module.scss';

export const AnalyticsToolbar = ({ isPeriodVisible }: AnalyticsToolbarProps) => {
  const t = useTranslations('analytics');
  const { period, periodOptions, accountItems, accountValue, setPeriod, onAccountChange } = useAnalyticsToolbar();

  return (
    <div className={s.root}>
      {accountItems.length > 0 && (
        <Select aria-label={t('account.label')} className={s.account} items={accountItems} value={accountValue} onValueChange={onAccountChange} />
      )}
      {isPeriodVisible && (
        <SegmentedControl<AnalyticsPeriod> aria-label={t('periods.label')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
      )}
    </div>
  );
};
