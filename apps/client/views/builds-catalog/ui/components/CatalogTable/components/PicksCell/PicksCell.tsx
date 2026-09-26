'use client';

import { useFormatter } from 'next-intl';

import { GameIcon, gameLabel } from '@/entities/tank/build';
import { percentText } from '@/shared/lib';

import type { PicksCellProps } from './PicksCell.types';

import { CATALOG_TABLE } from '../../../../../config';

import s from './PicksCell.module.scss';

export const PicksCell = ({ picks }: PicksCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root}>
      {picks.map(({ option, share }) => (
        <span key={option.id} className={s.item} title={`${gameLabel(option.name)} · ${percentText({ format, value: share * 100, digits: 0 })}`}>
          <GameIcon size={CATALOG_TABLE.iconSize} src={option.image} />
        </span>
      ))}
    </span>
  );
};
