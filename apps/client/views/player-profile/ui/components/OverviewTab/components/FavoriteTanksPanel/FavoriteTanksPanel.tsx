'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RatingValue, TankAwards } from '@/entities/player/stats';
import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useFavoriteTanks } from '../../../../../model/hooks';

import s from './FavoriteTanksPanel.module.scss';

export const FavoriteTanksPanel = () => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();
  const { rows, isPending, isError, isRetrying, retry } = useFavoriteTanks();

  return (
    <section aria-labelledby='profile-favorites' className={s.root}>
      <h2 className={s.title} id='profile-favorites'>
        {t('favoritesTitle')}
      </h2>
      {isPending && <Skeleton height={OVERVIEW.stripSkeletonHeight} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && rows.length === 0 && <EmptyState isCompact title={t('favoritesEmpty')} />}
      {rows.length > 0 && (
        <ol className={s.grid}>
          {rows.map(({ vehicle, battles, winRate, wn8, marksOnGun, markOfMastery }) => (
            <li key={vehicle.tankId}>
              <TankShowcaseCard
                figures={[
                  { id: 'battles', label: t('battles'), value: format.number(battles) },
                  { id: 'winRate', label: t('winRate'), value: <WinRateCell digits={1} value={winRate} /> },
                  { id: 'wn8', label: 'WN8', value: <RatingValue rating={wn8} /> }
                ]}
                footer={<TankAwards markOfMastery={markOfMastery} marksOnGun={marksOnGun} />}
                vehicle={vehicle}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
