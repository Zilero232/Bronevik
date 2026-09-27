'use client';

import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader, TankImage } from '@/ui-kit';

import type { CoachTanksProps } from './CoachTanks.types';

import s from './CoachTanks.module.scss';

export const CoachTanks = ({ vehicles }: CoachTanksProps) => {
  const t = useTranslations('coaching.coach');

  return (
    <Card padding='none'>
      <CardHeader title={t('tanks')} />
      <CardBody>
        <ul className={s.list}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.tankId} className={s.tank}>
              <TankImage size='small' tank={vehicle} />
              <span>{vehicle.shortName}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};
