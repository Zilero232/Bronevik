'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { Badge, DeltaValue } from '@/ui-kit';

import type { TankChangesProps } from './TankChanges.types';

import { VERDICT_DELTA, VERDICT_TONE } from '../../../../../config';

import s from './TankChanges.module.scss';

export const TankChanges = ({ tank: { name, vehicle, isNewVehicle, verdict, changes } }: TankChangesProps) => {
  const t = useTranslations('supertest.card');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <header className={s.head}>
        {vehicle ? <TankCell vehicle={vehicle} /> : <span className={s.name}>{name}</span>}
        {isNewVehicle && <Badge tone='accent'>{t('new')}</Badge>}
        <Badge tone={VERDICT_TONE[verdict]}>{t(`verdicts.${verdict}`)}</Badge>
      </header>
      <dl className={s.changes}>
        {changes.map((change) => (
          <div key={change.id} className={s.change}>
            <dt className={s.label}>{change.label}</dt>
            <dd className={s.value}>
              {change.to === null ? (
                change.raw
              ) : (
                <>
                  {(change.from ?? change.live) !== null && <span className={s.from}>{format.number(change.from ?? change.live ?? 0)} → </span>}
                  {format.number(change.to)}
                  {change.unit && ` ${change.unit}`}
                  {change.delta !== null && <DeltaValue className={s.delta} value={change.delta} verdict={VERDICT_DELTA[change.verdict]} />}
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
