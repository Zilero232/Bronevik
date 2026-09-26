'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ratingTone, toneOfTier } from '@/shared/lib';
import { buttonVariants, ErrorState, SectionHeader, Skeleton, StatTile } from '@/ui-kit';

import type { StreamerStatsProps } from './StreamerStats.types';

import { STREAMER_PAGE } from '../../../config';

import s from './StreamerStats.module.scss';

export const StreamerStats = ({ accountId }: StreamerStatsProps) => {
  const t = useTranslations('streamer.page.stats');
  const { data: profile, isPending, isError, error, isFetching, refetch } = usePlayerProfile(String(accountId));

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} />
      {match({ profile, isPending, isFailed: isError && !isNotFoundError(error) })
        .with({ profile: P.nonNullable }, ({ profile: { summary } }) => {
          const { battles, winRate, wn8, avgDamage } = summary.overall;
          const { value: wn8Value, tier: wn8Tier } = wn8;

          return (
            <>
              <div className={s.grid}>
                <StatTile label={t('battles')} tone='steel' value={battles} />
                <StatTile
                  format={STREAMER_PAGE.percentFormat}
                  label={t('winRate')}
                  suffix='%'
                  tone={winRate === null ? 'accent' : ratingTone({ scale: 'winRate', value: winRate })}
                  value={winRate ?? 0}
                />
                <StatTile label={t('wn8')} tone={wn8Tier ? toneOfTier(wn8Tier) : 'accent'} value={wn8Value ?? 0} />
                <StatTile label={t('avgDamage')} value={avgDamage ?? 0} />
              </div>
              <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.player(summary.nickname)}>
                {t('profile')}
                <ArrowRight size={15} />
              </Link>
            </>
          );
        })
        .with({ isPending: true }, () => <Skeleton height={120} shape='block' />)
        .with({ isFailed: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
        .otherwise(() => (
          <p className={s.hidden}>{t('hidden')}</p>
        ))}
    </section>
  );
};
