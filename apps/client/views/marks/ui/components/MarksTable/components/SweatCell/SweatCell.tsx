import { SweatBadge } from '@/entities/tank/tank';

import type { SweatCellProps } from './SweatCell.types';

import s from './SweatCell.module.scss';

export const SweatCell = ({ sweat }: SweatCellProps) =>
  sweat.moeLevel ? <SweatBadge level={sweat.moeLevel} ratio={sweat.moe} /> : <span className={s.empty}>—</span>;
