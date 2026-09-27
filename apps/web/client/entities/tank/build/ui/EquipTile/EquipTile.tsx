'use client';

import { clsx } from 'clsx';
import { ChevronsUp } from 'lucide-react';
import { useFormatter } from 'next-intl';

import { Tooltip } from '@/ui-kit';

import type { EquipTileProps } from './EquipTile.types';

import { EQUIP_TILE } from '../../config';
import { GameIcon } from '../GameIcon';

import s from './EquipTile.module.scss';

export const EquipTile = ({
  name,
  image,
  kind = 'optionalDevice',
  category = 'standard',
  size = 'md',
  share = null,
  isImproved = false,
  isSelected = false,
  isDimmed = false,
  className
}: EquipTileProps) => {
  const format = useFormatter();

  const px = EQUIP_TILE.sizes[size];

  const tile = (
    <span
      aria-label={name ?? undefined}
      className={clsx(s.root, s[size], className)}
      data-dimmed={isDimmed}
      data-empty={name === null}
      data-kind={category}
      data-selected={isSelected}
      role={name ? 'img' : undefined}
      style={{ width: px, height: px }}
    >
      {name !== null && <GameIcon kind={kind} size={Math.round(px * EQUIP_TILE.iconRatio)} src={image} />}
      {isImproved && size !== 'xs' && (
        <span aria-hidden className={s.chevron}>
          <ChevronsUp size={12} strokeWidth={2.5} />
        </span>
      )}
      {share !== null && size !== 'xs' && <span className={s.share}>{format.number(share, 'share')}</span>}
    </span>
  );

  return name ? <Tooltip content={name}>{tile}</Tooltip> : tile;
};
