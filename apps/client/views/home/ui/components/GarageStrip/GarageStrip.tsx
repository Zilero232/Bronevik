'use client';

import { useTranslations } from 'next-intl';

import { TankSlot } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { usePopularTanks } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';

import s from './GarageStrip.module.scss';

export const GarageStrip = () => {
  const t = useTranslations('home.garage');
  const { rows, isPending, isError, retry } = usePopularTanks();

  return (
    <section aria-labelledby='home-garage' className={s.root}>
      <SectionTitle id='home-garage' meta={t('period')} more={{ href: ROUTES.tanks.list, label: t('all') }} title={t('title')} />
      {isPending && (
        <div className={s.strip}>
          {Array.from({ length: HOME.garage.skeletons }, (_, index) => (
            <Skeleton key={index} className={s.skeleton} height={128} shape='block' />
          ))}
        </div>
      )}
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isPending && !isError && rows.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {rows.length > 0 && (
        <ul className={s.strip}>
          {rows.map((row) => (
            <li key={row.vehicle.tankId}>
              <TankSlot row={row} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
