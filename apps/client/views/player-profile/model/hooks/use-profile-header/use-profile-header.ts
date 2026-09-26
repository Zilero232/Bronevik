'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useProfileCosmetics } from '@/entities/player/cosmetics';
import { periodStats } from '@/entities/player/stats';
import { QUERY_KEYS } from '@/shared/constants';

import { getSeasonHistory } from '../../../api';
import { PROFILE_HEADER, PROFILE_PERIODS } from '../../../config';
import { heroArt } from '../../../lib/hero-art';
import { ratingRing } from '../../../lib/rating-ring';
import { useProfileContext } from '../../context';
import { usePlayerTanks } from '../use-profile-queries';

export const useProfileHeader = () => {
  const t = useTranslations('profile');
  const tPeriods = useTranslations('periods');
  const { profile, period, setPeriod } = useProfileContext();
  const { data: cosmetics } = useProfileCosmetics(profile.summary.accountId);
  const { data: tanks } = usePlayerTanks();
  const { data: seasons } = useQuery({
    queryKey: QUERY_KEYS.seasons(profile.summary.accountId),
    queryFn: () => getSeasonHistory(profile.summary.accountId)
  });

  const { summary } = profile;
  const current = periodStats({ overall: summary.overall, recent: profile.recent, period });
  const stats = current ?? summary.overall;

  return {
    summary,
    stats,
    wn8Ring: ratingRing(stats.wn8.tier),
    art: heroArt({ clan: summary.clan, rows: tanks?.items ?? [] }),
    hasPeriodData: current !== null,
    period,
    setPeriod,
    badge: cosmetics?.badge ?? null,
    banner: cosmetics?.banner ?? null,
    frame: cosmetics?.frame ?? null,
    seasons: (seasons?.items ?? []).slice(0, PROFILE_HEADER.seasons),
    periodOptions: PROFILE_PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }))
  };
};
