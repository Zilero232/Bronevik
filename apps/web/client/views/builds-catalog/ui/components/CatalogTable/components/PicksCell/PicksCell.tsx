'use client';

import { useFormatter } from 'next-intl';

import { GameIcon, gameLabel } from '@/entities/tank/build';
import { percentText } from '@/shared/lib';
import { Tooltip } from '@/ui-kit';

import type { PicksCellProps } from './PicksCell.types';

import { CATALOG_TABLE } from '../../../../../config';

import s from './PicksCell.module.scss';

export const PicksCell = ({ picks }: PicksCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root}>
      {picks.map(({ option, share }) => (
        <Tooltip key={option.id} content={gameLabel(option.name)}>
          <span aria-label={`${gameLabel(option.name)} · ${percentText({ format, value: share * 100, digits: 0 })}`} className={s.item}>
            <GameIcon kind={option.kind} size={CATALOG_TABLE.iconSize} src={option.image} />
            <span aria-hidden className={s.share}>
              {percentText({ format, value: share * 100, digits: 0 })}
            </span>
          </span>
        </Tooltip>
      ))}
    </span>
  );
};
