'use client';

import { useTranslations } from 'next-intl';

import { TankSlot } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { EmptyState, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { usePopularTanks } from '../../../model/hooks';

import s from './GarageStrip.module.scss';

export const GarageStrip = () => {
  const t = useTranslations('home.garage');
  const query = usePopularTanks();

  return (
    <section aria-labelledby='home-garage' className={s.root}>
      <SectionHeader id='home-garage' meta={t('period')} more={{ href: ROUTES.tanks.list, label: t('all') }} title={t('title')} variant='display' />
      <QueryState
        isCompact
        skeleton={
          <div className={s.strip}>
            <Skeleton className={s.skeleton} count={HOME.garage.skeletons} height={128} shape='block' />
          </div>
        }
        empty={<EmptyState isCompact isFramed title={t('empty')} />}
        query={query}
      >
        {(rows) => (
          <ul className={s.strip}>
            {rows.map((row) => (
              <li key={row.vehicle.tankId}>
                <TankSlot row={row} />
              </li>
            ))}
          </ul>
        )}
      </QueryState>
    </section>
  );
};
