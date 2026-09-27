import { clsx } from 'clsx';

import { TankImage } from '@/ui-kit';

import type { TankStripProps } from './TankStrip.types';

import s from './TankStrip.module.scss';

export const TankStrip = ({ vehicles, label, more = 0, className }: TankStripProps) => (
  <ul aria-label={label} className={clsx(s.root, className)}>
    {vehicles.map((vehicle) => (
      <li key={vehicle.tankId} className={s.tank} title={vehicle.name}>
        <TankImage size='small' tank={vehicle} />
      </li>
    ))}
    {more > 0 && <li className={s.more}>+{more}</li>}
  </ul>
);
