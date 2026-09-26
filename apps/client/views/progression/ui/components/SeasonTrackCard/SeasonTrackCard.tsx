'use client';

import { Check, Lock } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { CosmeticName } from '@/entities/player/cosmetics';
import { Card, CardHeader, ErrorState, ProgressBar, Skeleton } from '@/ui-kit';

import { PROGRESS_PAGE } from '../../../config';
import { useSeasonTrack } from '../../../model/hooks';

import s from './SeasonTrackCard.module.scss';

export const SeasonTrackCard = () => {
  const t = useTranslations('progression.season');
  const format = useFormatter();
  const { track, progress, isPending, isError, isRetrying, retry } = useSeasonTrack();

  if (isPending) {
    return <Skeleton height={PROGRESS_PAGE.skeletonHeight} shape='block' />;
  }

  if (isError || !track || !progress) {
    return <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />;
  }

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader
        meta={t('endsAt', { date: format.dateTime(new Date(track.season.endsAt), { day: 'numeric', month: 'long' }) })}
        title={t('title', { season: track.season.code.toUpperCase() })}
      />
      <p className={s.description}>{t('description')}</p>
      <div className={s.level}>
        <span className={s.levelValue}>{t('level', { level: track.level, max: track.maxLevel })}</span>
        <span className={s.points}>{t('points', { points: format.number(track.points) })}</span>
      </div>
      <ProgressBar
        max={progress.max}
        tone='accent'
        value={progress.value}
        valueLabel={progress.isMax ? t('maxed') : t('next', { points: format.number(progress.max - progress.value) })}
      />
      <ol className={s.rewards}>
        {track.rewards.map((reward) => (
          <li key={reward.level} className={s.reward} data-claimed={reward.isClaimed}>
            <span className={s.rewardLevel}>{t('rewardLevel', { level: reward.level })}</span>
            <span className={s.rewardName}>
              {reward.kind === 'shells' ? t('rewardShells', { amount: reward.amount }) : <CosmeticName code={reward.code} />}
            </span>
            <span aria-label={reward.isClaimed ? t('claimed') : t('locked')} className={s.rewardState}>
              {reward.isClaimed ? <Check size={14} /> : <Lock size={12} />}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
};
