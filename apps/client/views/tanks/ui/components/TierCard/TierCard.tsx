'use client';

import { useFormatter } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { TierCardProps } from './TierCard.types';

import s from './TierCard.module.scss';

export const TierCard = ({ entry }: TierCardProps) => {
  const format = useFormatter();

  const { vehicle, winRateDiff } = entry;

  return (
    <li className={s.root}>
      <Link className={s.link} href={ROUTES.tanks.detail(vehicle.slug)} title={vehicle.name}>
        <TankImage isDecorative size='small' tank={vehicleIdentity(vehicle)} />
        <span className={s.name} data-premium={vehicle.isPremium}>
          {vehicle.shortName}
        </span>
        <span className={s.diff} data-sign={Math.sign(winRateDiff)}>
          {format.number(winRateDiff, { maximumFractionDigits: 1, signDisplay: 'exceptZero' })}
        </span>
      </Link>
    </li>
  );
};
