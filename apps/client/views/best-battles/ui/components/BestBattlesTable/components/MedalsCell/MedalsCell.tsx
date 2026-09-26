'use client';

import { useFormatter } from 'next-intl';

import { BattleMedal } from '@/entities/battle/best-battle';

import type { MedalsCellProps } from './MedalsCell.types';

import { BEST_BATTLES_VIEW } from '../../../../../config';

import s from './MedalsCell.module.scss';

export const MedalsCell = ({ medals }: MedalsCellProps) => {
  const format = useFormatter();

  return medals.length === 0 ? (
    <span className={s.empty}>—</span>
  ) : (
    <span className={s.root}>
      {medals.slice(0, BEST_BATTLES_VIEW.medalsInRow).map((medal) => (
        <BattleMedal key={medal.name} medal={medal} />
      ))}
      {medals.length > BEST_BATTLES_VIEW.medalsInRow && (
        <span className={s.more}>+{format.number(medals.length - BEST_BATTLES_VIEW.medalsInRow)}</span>
      )}
    </span>
  );
};
