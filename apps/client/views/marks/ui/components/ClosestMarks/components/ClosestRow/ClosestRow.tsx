'use client';

import { MarkOfExcellenceIcon } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER_ITEM } from '@/shared/lib';
import { ProgressBar } from '@/ui-kit';

import type { ClosestRowProps } from '../../ClosestMarks.types';

import s from './ClosestRow.module.scss';

export const ClosestRow = ({ mark, index }: ClosestRowProps) => {
  const t = useTranslations('marks.closest');
  const format = useFormatter();
  const { vehicle, percent, nextMark, nextMarks, damageToNext, progress } = mark;

  return (
    <motion.li className={s.root} variants={STAGGER_ITEM}>
      <span className={s.rank}>{String(index + 1).padStart(2, '0')}</span>
      <Link className={s.tank} href={ROUTES.tank(vehicle.slug)}>
        <TankIdentity tank={vehicleIdentity(vehicle)} />
      </Link>
      <ProgressBar
        className={s.progress}
        label={t('toMark', { percent: format.number(percent, { maximumFractionDigits: 2 }), mark: nextMark })}
        size='sm'
        tone={nextMarks === 3 ? 'accent' : 'steel'}
        value={progress * 100}
      />
      <span className={s.damage}>
        <MarkOfExcellenceIcon aria-hidden className={s.markIcon} marks={nextMarks} size={20} />
        <span className={s.damageValue}>+{format.number(damageToNext)}</span>
        <span className={s.damageLabel}>{t('damageLeft')}</span>
      </span>
    </motion.li>
  );
};
