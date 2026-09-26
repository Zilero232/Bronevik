'use client';

import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ProgressRing } from '@/ui-kit';

import type { ClosestRowProps } from './ClosestRow.types';

import s from './ClosestRow.module.scss';

export const ClosestRow = ({ mark }: ClosestRowProps) => {
  const t = useTranslations('marks.closest');
  const format = useFormatter();
  const { vehicle, percent, nextMark, nextMarks, damageToNext, progress } = mark;
  const toMark = t('toMark', { percent: format.number(percent, { maximumFractionDigits: 2 }), mark: nextMark });

  return (
    <li className={s.root} data-marks={nextMarks}>
      <ProgressRing className={s.ring} label={toMark} max={1} size={64} thickness={6} value={progress}>
        <MarkOfExcellenceIcon aria-hidden className={s.glyph} marks={nextMarks} size={24} />
      </ProgressRing>
      <span className={s.info}>
        <Link className={s.tank} href={ROUTES.tanks.detail(vehicle.slug)}>
          <TankCell image='contour' vehicle={vehicle} />
        </Link>
        <span className={s.damage}>+{format.number(damageToNext)}</span>
        <span className={s.percent}>{toMark}</span>
      </span>
    </li>
  );
};
