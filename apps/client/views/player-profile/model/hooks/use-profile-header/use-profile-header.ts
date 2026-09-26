'use client';

import { useTranslations } from 'next-intl';

import { periodStats } from '@/entities/player/stats';

import { PROFILE_PERIODS } from '../../../config';
import { useProfileContext } from '../../context';

export const useProfileHeader = () => {
  const t = useTranslations('profile');
  const tPeriods = useTranslations('periods');
  const { profile, period, setPeriod } = useProfileContext();

  const { summary } = profile;
  const current = periodStats({ overall: summary.overall, recent: profile.recent, period });

  return {
    summary,
    stats: current ?? summary.overall,
    hasPeriodData: current !== null,
    period,
    setPeriod,
    periodOptions: PROFILE_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }))
  };
};
