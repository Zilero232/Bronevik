'use client';

import { AnimatePresence, motion } from 'motion/react';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { SPRING } from '@/shared/lib';
import { AnimatedNumber } from '@/ui-kit';

import type { StatValueProps } from './StatValue.types';

import { BUILD_VIEW } from '../../../../../config';
import { STAT_BAR } from '../../../../../lib/stat-diff';
import { FLASH } from './StatValue.motion';

import s from './StatValue.module.scss';

export const StatValue = ({ statKey, value, fill, verdict, isWinner = false }: StatValueProps) => {
  const format = useSpecFormat();

  const { digits } = TANK_SPECS[statKey];
  const unit = format.unit(statKey);

  return (
    <span className={s.root} data-verdict={verdict} data-winner={isWinner}>
      <AnimatePresence initial={false}>
        <motion.span aria-hidden key={value ?? 'none'} animate='visible' className={s.flash} exit='exit' initial='hidden' variants={FLASH} />
      </AnimatePresence>
      <span className={s.number}>
        {value === null ? (
          '—'
        ) : (
          <AnimatedNumber
            duration={BUILD_VIEW.statDuration}
            format={{ maximumFractionDigits: digits, minimumFractionDigits: Math.min(digits, 1) }}
            from={value}
            value={value}
          />
        )}
        {unit && <span className={s.unit}>{unit}</span>}
      </span>
      <span aria-hidden className={s.track}>
        <span className={s.base} style={{ left: `${STAT_BAR.baseMark * 100}%` }} />
        <motion.span animate={{ scaleX: fill }} className={s.fill} initial={{ scaleX: 0 }} transition={SPRING} />
      </span>
    </span>
  );
};
