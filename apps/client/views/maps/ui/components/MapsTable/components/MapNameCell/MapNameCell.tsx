import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { MapNameCellProps } from './MapNameCell.types';

import s from './MapNameCell.module.scss';

export const MapNameCell = ({ name, slug }: MapNameCellProps) => (
  <Link className={s.root} href={ROUTES.maps.detail(slug)}>
    {name}
  </Link>
);
