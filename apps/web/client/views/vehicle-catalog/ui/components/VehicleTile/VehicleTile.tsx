import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { CompareToggle } from '@/features/compare/compare-selection';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { VehicleTileProps } from './VehicleTile.types';

import s from './VehicleTile.module.scss';

export const VehicleTile = ({ vehicle }: VehicleTileProps) => {
  const tank = vehicleIdentity(vehicle);

  return (
    <li className={s.root}>
      <Link
        className={s.link}
        data-class={tank.type}
        data-nation={tank.nation}
        data-premium={vehicle.isPremium}
        href={ROUTES.tanks.detail(vehicle.slug)}
      >
        <span className={s.stage}>
          <TankImage isDecorative className={s.render} size='big' tank={tank} withTint={false} />
        </span>
        <TankIdentity className={s.identity} tank={tank} />
      </Link>
      <CompareToggle className={s.compare} entry={{ kind: 'tank', item: vehicle }} />
    </li>
  );
};
