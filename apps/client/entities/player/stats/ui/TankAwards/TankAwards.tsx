'use client';

import { MarkOfExcellenceIcon, MasteryIcon } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { Tooltip } from '@/ui-kit';

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
        <Tooltip content={t('marks', { count: marks })}>
          <span aria-label={t('marks', { count: marks })} className={s.mark} data-marks={marks}>
            <MarkOfExcellenceIcon aria-hidden marks={marks} size={TANK_AWARDS.markSize} strokeWidth={TANK_AWARDS.strokeWidth} />
          </span>
        </Tooltip>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
      {mastery ? (
        <Tooltip content={t(`mastery.${mastery}`)}>
          <span aria-label={t(`mastery.${mastery}`)} className={s.mastery} data-level={mastery}>
            <MasteryIcon aria-hidden tinted level={mastery} size={TANK_AWARDS.masterySize} strokeWidth={TANK_AWARDS.strokeWidth} />
          </span>
        </Tooltip>
      ) : (
        <span aria-hidden className={s.empty} />
      )}
    </span>
  );
};
