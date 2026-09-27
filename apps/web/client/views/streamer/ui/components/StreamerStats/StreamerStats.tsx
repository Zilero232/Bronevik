'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ratingTone, toneOfTier } from '@/shared/lib';
import { buttonVariants, KeyFigure, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import type { StreamerStatsProps } from './StreamerStats.types';

import { STREAMER_PAGE } from '../../../config';

import s from './StreamerStats.module.scss';

export const StreamerStats = ({ accountId }: StreamerStatsProps) => {
  const t = useTranslations('streamer.page.stats');
  const query = usePlayerProfile(String(accountId));

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} />
      <QueryState
        errorState={isNotFoundError(query.error) ? <p className={s.hidden}>{t('hidden')}</p> : undefined}
        query={query}
        skeleton={<Skeleton height={120} shape='block' />}
      >
        {({ summary }) => {
          const { battles, winRate, wn8, avgDamage } = summary.overall;

          return (
            <>
              <div className={s.grid}>
                <KeyFigure isFramed label={t('battles')} tone='steel' value={battles} />
                <KeyFigure
                  isFramed
                  format={STREAMER_PAGE.percentFormat}
                  label={t('winRate')}
                  suffix='%'
                  tone={winRate === null ? 'accent' : ratingTone({ scale: 'winRate', value: winRate })}
                  value={winRate ?? 0}
                />
                <KeyFigure isFramed label={t('wn8')} tone={wn8.tier ? toneOfTier(wn8.tier) : 'accent'} value={wn8.value ?? 0} />
                <KeyFigure isFramed label={t('avgDamage')} value={avgDamage ?? 0} />
              </div>
              <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.players.profile(summary.nickname)}>
                {t('profile')}
                <ArrowRight size={15} />
              </Link>
            </>
          );
        }}
      </QueryState>
    </section>
  );
};
