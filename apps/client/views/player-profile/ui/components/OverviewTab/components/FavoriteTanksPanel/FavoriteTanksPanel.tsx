'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankAwards } from '@/entities/player/stats';
import { TankIdentity, TankImage, vehicleIdentity, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { OVERVIEW } from '../../../../../config';
import { useFavoriteTanks } from '../../../../../model/hooks';
import { ProfilePanel } from '../../../ProfilePanel';
import { RatingValue } from '../../../RatingValue';

import s from './FavoriteTanksPanel.module.scss';

export const FavoriteTanksPanel = () => {
  const t = useTranslations('profile.overview');
  const format = useFormatter();
  const { rows, isPending, isError, isRetrying, retry } = useFavoriteTanks();

  return (
    <ProfilePanel className={s.root} title={t('favoritesTitle')}>
      {isPending && <Skeleton height={OVERVIEW.stripSkeletonHeight} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && rows.length === 0 && <EmptyState isCompact title={t('favoritesEmpty')} />}
      {rows.length > 0 && (
        <ol className={s.strip}>
          {rows.map(({ vehicle, battles, winRate, wn8, marksOnGun, markOfMastery }) => (
            <li key={vehicle.tankId} className={s.slot} data-nation={vehicle.nation}>
              <Link className={s.link} href={ROUTES.tank(vehicle.slug)}>
                <TankImage withTint className={s.image} size='big' tank={vehicleIdentity(vehicle)} />
                <TankIdentity className={s.name} tank={vehicleIdentity(vehicle)} withNation={false} />
              </Link>
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
              <TankAwards markOfMastery={markOfMastery} marksOnGun={marksOnGun} />
            </li>
          ))}
        </ol>
      )}
    </ProfilePanel>
  );
};
