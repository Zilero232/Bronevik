'use client';

import { MarkOfExcellenceIcon, MasteryIcon } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { TankAwardsProps } from './TankAwards.types';

import { TANK_AWARDS } from '../../config';

import s from './TankAwards.module.scss';

export const TankAwards = ({ marksOnGun, markOfMastery, className }: TankAwardsProps) => {
  const t = useTranslations('profile.awards');

  const marks = TANK_AWARDS.marks.find((count) => count === marksOnGun);
  const mastery = TANK_AWARDS.mastery[markOfMastery];

  return (
    <span className={clsx(s.root, className)}>
      {marks ? (
        <span className={s.mark} data-marks={marks} title={t('marks', { count: marks })}>
          <MarkOfExcellenceIcon marks={marks} size={TANK_AWARDS.markSize} strokeWidth={TANK_AWARDS.strokeWidth} />
        </span>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
      {mastery ? (
        <span className={s.mastery} data-level={mastery} title={t(`mastery.${mastery}`)}>
          <MasteryIcon tinted level={mastery} size={TANK_AWARDS.masterySize} strokeWidth={TANK_AWARDS.strokeWidth} />
        </span>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
    </span>
  );
};
