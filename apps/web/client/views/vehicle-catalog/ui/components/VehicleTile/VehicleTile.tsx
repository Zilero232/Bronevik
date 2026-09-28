import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { VehicleTileProps } from './VehicleTile.types';

import s from './VehicleTile.module.scss';

export const VehicleTile = ({ vehicle }: VehicleTileProps) => {
  const tank = vehicleIdentity(vehicle);

  return (
    <li className={s.root}>
      <Link className={s.link} data-nation={tank.nation} data-premium={vehicle.isPremium} href={ROUTES.tanks.detail(vehicle.slug)}>
        <span className={s.render}>
          <TankImage isDecorative size='small' tank={tank} />
        </span>
        <TankIdentity className={s.identity} tank={tank} />
      </Link>
    </li>
  );
};
