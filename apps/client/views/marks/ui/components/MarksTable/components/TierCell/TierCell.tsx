import { toRoman } from '@otmetki/icons';

import type { TierCellProps } from './TierCell.types';

import s from './TierCell.module.scss';

export const TierCell = ({ tier }: TierCellProps) => <span className={s.root}>{toRoman(tier)}</span>;
