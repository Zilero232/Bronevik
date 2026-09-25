'use client';

import { BRONYA_INDEX } from '@bronevik/ratings';
import { useTranslations } from 'next-intl';

import { periodStats, ratingValueTone, winRateTone } from '@/entities/player/stats';
import { AnimatedNumber, ProgressRing, RatingBadge } from '@/ui-kit';

import { useProfileContext } from '../../../../../model/context';

import s from './HeroRatings.module.scss';

const PERCENT_FORMAT = { maximumFractionDigits: 2, minimumFractionDigits: 2 } as const;

export const HeroRatings = () => {
  const t = useTranslations('profile.hero');
  const tRating = useTranslations('rating');
  const { profile, period } = useProfileContext();

  const { overall } = profile.summary;
  const current = periodStats({ overall, recent: profile.recent, period });
  const stats = current ?? overall;
  const broneIndex = stats.broneIndex.value ?? 0;
  const biTone = ratingValueTone(stats.broneIndex);

  return (
    <div className={s.root}>
      <ProgressRing className={s.ring} label={t('broneIndex')} max={BRONYA_INDEX.scale} size={156} thickness={8} tone={biTone} value={broneIndex}>
        <span className={s.ringLabel}>{t('broneIndexShort')}</span>
        <AnimatedNumber className={s.ringValue} value={broneIndex} />
        <span className={s.ringTier} data-tone={biTone}>
          {tRating(biTone)}
        </span>
      </ProgressRing>
      <div className={s.badges}>
        <RatingBadge label='WN8' size='lg' tone={ratingValueTone(stats.wn8)} value={<AnimatedNumber value={stats.wn8.value ?? 0} />} />
        <RatingBadge
          label={t('winRate')}
          size='lg'
          tone={winRateTone(stats.winRate)}
          value={<AnimatedNumber format={PERCENT_FORMAT} suffix='%' value={stats.winRate ?? 0} />}
        />
        <div className={s.battles}>
          <AnimatedNumber className={s.battlesValue} value={stats.battles} />
          <span className={s.battlesLabel}>{t('battles')}</span>
        </div>
        {!current && <span className={s.fallback}>{t('noPeriodData')}</span>}
      </div>
    </div>
  );
};
