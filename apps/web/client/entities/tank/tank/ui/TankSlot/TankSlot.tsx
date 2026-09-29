import { TANK_CLASS_ICONS, toRoman } from '@otmetki/icons';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { TankImage } from '@/ui-kit';

import type { TankSlotProps } from './TankSlot.types';

import { TANK_SLOT } from '../../config';
import { vehicleIdentity } from '../../lib/vehicle-identity';
import { WinRateCell } from '../WinRateCell';

import s from './TankSlot.module.scss';

export const TankSlot = ({ row }: TankSlotProps) => {
  const tank = vehicleIdentity(row.vehicle);
  const ClassIcon = TANK_CLASS_ICONS[tank.type];

  return (
    <Link
      className={s.root}
      data-class={tank.type}
      data-nation={tank.nation}
      data-premium={tank.isPremium || undefined}
      href={ROUTES.tanks.detail(row.vehicle.slug)}
    >
      <span className={s.badge}>
        <ClassIcon aria-hidden size={TANK_SLOT.classIconSize} variant={tank.isPremium ? 'premium' : 'regular'} />
        <span className={s.tier}>{toRoman(tank.tier)}</span>
      </span>
      <TankImage isDecorative className={s.render} size='big' tank={tank} />
      <span className={s.footer}>
        <span className={s.name}>{tank.name}</span>
        <WinRateCell className={s.rate} digits={1} value={row.winRate} />
      </span>
    </Link>
  );
};
