'use client';

import { useSpecFormat } from '@/entities/tank/tank';

import type { StatValueProps } from './StatValue.types';

import { STAT_BAR } from '../../../../../config';

import s from './StatValue.module.scss';

export const StatValue = ({ statKey, value, fill, verdict, isWinner = false, isCompare = false }: StatValueProps) => {
  const format = useSpecFormat();

  const unit = format.unit(statKey);

  return (
    <span className={s.root} data-compare={isCompare} data-verdict={verdict} data-winner={isWinner}>
      <span className={s.number}>
        {format.value({ key: statKey, value })}
        {unit && <span className={s.unit}>{unit}</span>}
      </span>
      <span aria-hidden className={s.track}>
        <span className={s.base} style={{ left: `${STAT_BAR.baseMark * 100}%` }} />
        <span className={s.fill} style={{ scale: `${fill} 1` }} />
      </span>
    </span>
  );
};
