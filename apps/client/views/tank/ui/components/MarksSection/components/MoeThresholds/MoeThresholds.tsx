'use client';

import { motion } from 'motion/react';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { MoeThresholdsProps } from './MoeThresholds.types';

import { MOE_DELTA_DAYS } from '../../../../../config';
import { moeDelta } from '../../../../../lib';
import { useMoeHistory } from '../../../../../model/hooks';
import { MarkPlate } from '../MarkPlate';
import { MOE_PLATES } from './MoeThresholds.constants';

import s from './MoeThresholds.module.scss';

export const MoeThresholds = ({ moe }: MoeThresholdsProps) => {
  const { data: history } = useMoeHistory();

  return (
    <motion.ul className={s.root} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
      {MOE_PLATES.map(({ key, percent, marks, isFeatured }) => (
        <motion.li key={key} className={s.item} variants={STAGGER_ITEM}>
          <MarkPlate
            deltas={MOE_DELTA_DAYS.map((days) => ({ days, value: history ? moeDelta({ history, key, days }) : null }))}
            isFeatured={isFeatured}
            marks={marks}
            moeKey={key}
            percent={percent}
            value={moe[key]}
          />
        </motion.li>
      ))}
    </motion.ul>
  );
};
