'use client';

import type { MarkCount, MasteryLevel } from '@bronevik/icons';

import { MarkOfExcellenceIcon, MasteryIcon } from '@bronevik/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { TankAwardsProps } from './TankAwards.types';

import s from './TankAwards.module.scss';

const MASTERY_ICON: Record<number, MasteryLevel | undefined> = { 1: 'third', 2: 'second', 3: 'first', 4: 'master' };

const MARK_COUNTS: readonly MarkCount[] = [1, 2, 3];

export const TankAwards = ({ marksOnGun, markOfMastery, className }: TankAwardsProps) => {
  const t = useTranslations('profile.awards');

  const marks = MARK_COUNTS.find((count) => count === marksOnGun);
  const mastery = MASTERY_ICON[markOfMastery];

  return (
    <span className={clsx(s.root, className)}>
      {marks ? (
        <span className={s.mark} data-marks={marks} title={t('marks', { count: marks })}>
          <MarkOfExcellenceIcon marks={marks} size={20} strokeWidth={1.6} />
        </span>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
      {mastery ? (
        <span className={s.mastery} data-level={mastery} title={t(`mastery.${mastery}`)}>
          <MasteryIcon tinted level={mastery} size={18} strokeWidth={1.6} />
        </span>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
    </span>
  );
};
