import { toRoman } from '@otmetki/icons';

import type { TierCellProps } from './TierCell.types';

import { TANKS_TABLE } from '../../../../../config';

import s from './TierCell.module.scss';

export const TierCell = ({ tier }: TierCellProps) => (
  <span className={s.root} data-top={tier >= TANKS_TABLE.topTier}>
    {toRoman(tier)}
  </span>
);
