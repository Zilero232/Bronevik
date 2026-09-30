import clsx from 'clsx';

import type { CardTileProps } from './CardTile.types';

import { Icon } from '../../../../../shared/ui/icon';

import s from './CardTile.module.scss';

export const CardTile = ({ icon, enabled }: CardTileProps) => (
  <span className={clsx(s.tile, enabled && s.tileOn)}>
    <Icon name={icon} size={22} tone={enabled ? 'accent' : 'muted'} />
  </span>
);
