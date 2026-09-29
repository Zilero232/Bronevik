import { GameIcon, gameLabel } from '@/entities/tank/build';
import { ProgressBar } from '@/ui-kit';

import type { UsageRowProps } from './UsageRow.types';

import { HOW_TO_BUILD } from '../../../../../config';

import s from './UsageRow.module.scss';

export const UsageRow = ({ kind, image, label, share, valueLabel, tone }: UsageRowProps) => (
  <li className={s.root}>
    <GameIcon kind={kind} size={HOW_TO_BUILD.iconSize} src={image} />
    <ProgressBar className={s.bar} label={gameLabel(label)} size='sm' tone={tone} value={share * 100} valueLabel={valueLabel} />
  </li>
);
