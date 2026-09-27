'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ProgressBar } from '@/ui-kit';

import type { MarkRowProps } from './MarkRow.types';

import s from './MarkRow.module.scss';

export const MarkRow = ({ chase }: MarkRowProps) => {
  const t = useTranslations('tg.marks');
  const format = useFormatter();

  const { row, percent, target } = chase;
  const tank = vehicleIdentity(row.vehicle);

  return (
    <li className={s.root}>
      <TankImage className={s.image} size='contour' tank={tank} />
      <div className={s.body}>
        <ProgressBar
          label={tank.name}
          size='sm'
          tone='accent'
          value={percent}
          valueLabel={t('progress', { current: format.number(percent, { maximumFractionDigits: 1 }), target })}
        />
        {row.damageToNextMark !== null && (
          <span className={s.hint}>{t('damageLeft', { damage: format.number(Math.round(row.damageToNextMark)) })}</span>
        )}
      </div>
    </li>
  );
};
