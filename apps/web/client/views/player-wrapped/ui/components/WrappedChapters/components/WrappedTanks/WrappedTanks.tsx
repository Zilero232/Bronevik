'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';

import type { WrappedTanksProps } from './WrappedTanks.types';

import { WrappedFact } from '../WrappedFact';

import s from './WrappedTanks.module.scss';

export const WrappedTanks = ({ topTanks }: WrappedTanksProps) => {
  const t = useTranslations('wrapped.chapters.tanks');
  const format = useFormatter();

  return (
    <ol className={s.root}>
      {topTanks.map(({ tankId, place, battles, damageDealt, vehicle }) => (
        <li key={tankId}>
          {vehicle ? (
            <TankShowcaseCard
              figures={[
                { id: 'battles', label: t('battles'), value: format.number(battles, 'integer') },
                { id: 'damage', label: t('damage'), value: format.number(damageDealt, 'compact') }
              ]}
              href={ROUTES.tanks.detail(vehicle.slug)}
              meta={t('place', { place })}
              vehicle={vehicle}
            />
          ) : (
            <WrappedFact label={t('unknownTank', { place, tankId })} value={battles} />
          )}
        </li>
      ))}
    </ol>
  );
};
