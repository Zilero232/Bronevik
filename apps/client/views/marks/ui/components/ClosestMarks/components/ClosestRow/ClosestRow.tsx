'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ClosestRowProps } from './ClosestRow.types';

import s from './ClosestRow.module.scss';

export const ClosestRow = ({ mark }: ClosestRowProps) => {
  const t = useTranslations('marks.closest');
  const format = useFormatter();
  const { vehicle, percent, nextMark, damageToNext } = mark;

  return (
    <li className={s.root}>
      <Link className={s.tank} href={ROUTES.tank(vehicle.slug)}>
        <TankCell image='contour' vehicle={vehicle} />
      </Link>
      <span className={s.figures}>
        <span className={s.damage}>+{format.number(damageToNext)}</span>
        <span className={s.percent}>{t('toMark', { percent: format.number(percent, { maximumFractionDigits: 2 }), mark: nextMark })}</span>
      </span>
    </li>
  );
};
