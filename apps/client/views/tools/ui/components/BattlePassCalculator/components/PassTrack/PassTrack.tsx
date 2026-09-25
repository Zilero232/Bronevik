'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { clamp } from 'remeda';

import { EASE_OUT } from '@/shared/lib';

import type { PassTrackProps } from '../../BattlePassCalculator.types';

import s from './PassTrack.module.scss';

export const PassTrack = ({ stages, progress }: PassTrackProps) => {
  const t = useTranslations('tools.pass');
  const format = useFormatter();

  const ratio = clamp(progress, { min: 0, max: 1 });

  return (
    <div
      aria-label={t('trackLabel')}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(ratio * 100)}
      className={s.root}
      role='progressbar'
    >
      <div className={s.head}>
        <span className={s.label}>{t('trackLabel')}</span>
        <span className={s.value}>{format.number(ratio, { style: 'percent', maximumFractionDigits: 0 })}</span>
      </div>
      <div className={s.track}>
        <motion.span animate={{ scaleX: ratio }} className={s.fill} initial={{ scaleX: 0 }} transition={{ duration: 0.9, ease: EASE_OUT }} />
        <span aria-hidden className={s.ticks} style={{ backgroundSize: `${100 / Math.max(1, stages)}% 100%` }} />
      </div>
    </div>
  );
};
