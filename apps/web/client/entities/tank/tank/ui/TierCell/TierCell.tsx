import { toRoman } from '@otmetki/icons';

import type { TierCellProps } from './TierCell.types';

import { TANK_TABLE } from '../../config';

import s from './TierCell.module.scss';

export const TierCell = ({ tier, isTopAccented = true }: TierCellProps) => (
  <span className={s.root} data-top={isTopAccented && tier >= TANK_TABLE.topTier}>
    {toRoman(tier)}
  </span>
);
