'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { RatingValue, TankAwards } from '@/entities/player/stats';
import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useFavoriteTanks } from '../../../../../model/hooks';

import s from './FavoriteTanksPanel.module.scss';

export const FavoriteTanksPanel = () => {
  const t = useTranslations('profile.overview');
  const tCommon = useTranslations('common');
  const format = useFormatter();
  const titleId = useId();
  const { query, rows } = useFavoriteTanks();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <h2 className={s.title} id={titleId}>
        {t('favoritesTitle')}
      </h2>
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('favoritesEmpty')} />}
        isEmpty={() => rows.length === 0}
        query={query}
        skeleton={<Skeleton height={OVERVIEW.stripSkeletonHeight} shape='block' />}
      >
        <ol className={s.grid}>
          {rows.map(({ vehicle, battles, winRate, wn8, marksOnGun, markOfMastery }) => (
            <li key={vehicle.tankId}>
              <TankShowcaseCard
                figures={[
                  { id: 'battles', label: t('battles'), value: format.number(battles) },
                  { id: 'winRate', label: t('winRate'), value: <WinRateCell digits={1} value={winRate} /> },
                  { id: 'wn8', label: tCommon('ratings.wn8'), value: <RatingValue rating={wn8} /> }
                ]}
                footer={<TankAwards markOfMastery={markOfMastery} marksOnGun={marksOnGun} />}
                vehicle={vehicle}
              />
            </li>
          ))}
        </ol>
      </QueryState>
    </section>
  );
};
