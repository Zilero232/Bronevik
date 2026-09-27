'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { TankImage } from '@/ui-kit';

import type { FavouriteTanksProps } from './FavouriteTanks.types';

import s from './FavouriteTanks.module.scss';

export const FavouriteTanks = ({ favourites }: FavouriteTanksProps) => {
  const t = useTranslations('streamersDirectory.card');

  return (
    <div className={s.root}>
      <span className={s.label}>{t('favourites')}</span>
      <ul className={s.list}>
        {favourites.map(({ tankId, name, vehicle }) => (
          <li key={tankId} className={s.item}>
            {vehicle ? (
              <Link className={s.tank} href={ROUTES.tanks.detail(vehicle.slug)}>
                <TankImage isDecorative size='small' tank={vehicle} />
                <span className={s.name}>{name}</span>
              </Link>
            ) : (
              <span className={s.name}>{name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
