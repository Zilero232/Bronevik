'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RatingValue, TankAwards } from '@/entities/player/stats';
import { TankImage, vehicleIdentity, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { EmptyState, ErrorState, Skeleton, TierNumeral } from '@/ui-kit';

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
              <Link className={s.card} data-class={vehicle.type} data-nation={vehicle.nation} href={ROUTES.tanks.detail(vehicle.slug)}>
                <span className={s.stage}>
                  <TierNumeral className={s.tier} tier={vehicle.tier} variant='hex' />
                  <TankImage className={s.image} size='big' tank={vehicleIdentity(vehicle)} />
                </span>
                <span className={s.name} data-premium={vehicle.isPremium || undefined}>
                  {vehicle.shortName}
                </span>
                <dl className={s.stats}>
                  <div>
                    <dt>{t('battles')}</dt>
                    <dd>{format.number(battles)}</dd>
                  </div>
                  <div>
                    <dt>{t('winRate')}</dt>
                    <dd>
                      <WinRateCell digits={1} value={winRate} />
                    </dd>
                  </div>
                  <div>
                    <dt>WN8</dt>
                    <dd>
                      <RatingValue rating={wn8} />
                    </dd>
                  </div>
                </dl>
                <TankAwards className={s.awards} markOfMastery={markOfMastery} marksOnGun={marksOnGun} />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
