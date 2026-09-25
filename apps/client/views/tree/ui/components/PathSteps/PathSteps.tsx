'use client';

import { toRoman } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROW_ITEM } from '@/shared/lib';

import type { PathStepsProps } from './PathSteps.types';

import s from './PathSteps.module.scss';

export const PathSteps = ({ steps }: PathStepsProps) => {
  const t = useTranslations('tree.path');
  const format = useFormatter();

  const target = steps.at(-1)?.vehicle.tankId;

  return (
    <motion.ol key={target} animate='visible' aria-label={t('route')} className={s.root} initial='hidden'>
      {steps.map(({ vehicle, xp }, index) => (
        <motion.li key={vehicle.tankId} className={s.step} custom={index} data-root={index === 0} variants={ROW_ITEM}>
          <span aria-hidden className={s.dot} />
          <span className={s.tier}>{toRoman(vehicle.tier)}</span>
          <span className={s.name}>{vehicle.shortName || vehicle.name}</span>
          <span className={s.xp}>{index === 0 || xp === null ? t('start') : format.number(xp)}</span>
        </motion.li>
      ))}
    </motion.ol>
  );
};
