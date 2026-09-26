'use client';

import { useTranslations } from 'next-intl';

import { OVERVIEW } from '../../../config';
import { periodRatings } from '../../../lib/period-ratings';
import { useProfileContext } from '../../context';

export const usePeriodRatings = () => {
  const t = useTranslations('profile');
  const tPeriods = useTranslations('periods');
  const { profile } = useProfileContext();

  return periodRatings({ profile, periods: OVERVIEW.periods }).map((row) => ({
    ...row,
    label: row.period === 'overall' ? t('overall') : tPeriods(row.period)
  }));
};
