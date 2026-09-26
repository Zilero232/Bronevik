import { clsx } from 'clsx';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { TankLinkProps } from './TankLink.types';

import { TankCell } from '../TankCell';

import s from './TankLink.module.scss';

export const TankLink = ({ vehicle, image = 'contour', className }: TankLinkProps) => (
  <Link className={clsx(s.root, className)} href={ROUTES.tank(vehicle.slug)}>
    <TankCell image={image} vehicle={vehicle} />
  </Link>
);
