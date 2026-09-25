'use client';

import { MOE } from '@bronevik/ratings';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { TankAwards } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROW_ITEM } from '@/shared/lib';

import type { MarkRowProps } from './MarkRow.types';

import { MARKS } from '../../../../../config';
import { projectMarks } from '../../../../../lib/marks-projection';

import s from './MarkRow.module.scss';

export const MarkRow = ({ row, averageDamage, index }: MarkRowProps) => {
  const t = useTranslations('profile.marks');
  const format = useFormatter();

  const { vehicle, moePercent, marksOnGun, markOfMastery, nextMarkPercent, damageToNextMark, battles } = row;
  const percent = moePercent ?? 0;
  const projection = projectMarks({ row, averageDamage, targetPercent: MARKS.targetPercent });

  return (
    <motion.li animate='visible' className={s.root} custom={index} initial='hidden' variants={ROW_ITEM}>
      <div className={s.tank}>
        <TankIdentity tank={vehicleIdentity(vehicle)} />
        <span className={s.battles}>{t('battles', { count: battles })}</span>
      </div>
      <div className={s.progress}>
        <div className={s.head}>
          <span className={s.percent}>{format.number(percent, { maximumFractionDigits: 2 })}%</span>
          {nextMarkPercent !== null && damageToNextMark !== null && (
            <span className={s.next}>{t('toNext', { percent: nextMarkPercent, damage: format.number(damageToNextMark) })}</span>
          )}
        </div>
        <div aria-hidden className={s.track}>
          <motion.span
            animate={{ width: `${percent}%` }}
            className={s.fill}
            initial={{ width: 0 }}
            transition={{ duration: 0.9, delay: Math.min(index, 12) * 0.03 }}
          />
          {MOE.markPercents.map((mark) => (
            <span key={mark} className={s.tick} data-reached={percent >= mark} style={{ left: `${mark}%` }} />
          ))}
        </div>
        <span className={s.projection} data-kind={projection.kind}>
          {match(projection)
            .with({ kind: 'projected' }, ({ battles: count }) => t('projection.projected', { count }))
            .otherwise(({ kind }) => t(`projection.${kind}`))}
        </span>
      </div>
      <TankAwards className={s.awards} markOfMastery={markOfMastery} marksOnGun={marksOnGun} />
    </motion.li>
  );
};
