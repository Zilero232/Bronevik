'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Band, Card, DataSourceNote, DataTable, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useMarksMovement, useMarksMovementColumns } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';
import { MarkGainCard } from './components';

import s from './MarksMovement.module.scss';

export const MarksMovement = () => {
  const t = useTranslations('home.marks');
  const { rows, leaders, updatedAt, isPending, isError, retry } = useMarksMovement();
  const columns = useMarksMovementColumns();

  return (
    <Band aria-labelledby='home-marks' innerClassName={s.inner}>
      <SectionTitle id='home-marks' meta={t('period')} more={{ href: ROUTES.marks, label: t('all') }} title={t('title')} />
      {isError ? (
        <ErrorState isCompact onRetry={retry} />
      ) : (
        <div className={s.split}>
          <Card padding='none'>
            <DataTable
              columns={columns}
              data={rows}
              density='media'
              emptyState={<EmptyState isCompact title={t('empty')} />}
              getRowId={(row) => String(row.vehicle.tankId)}
              isLoading={isPending}
            />
          </Card>
          <div className={s.leaders}>
            <h3 className={s.subtitle}>{t('leaders')}</h3>
            {isPending &&
              Array.from({ length: HOME.marks.highlights }, (_, index) => <Skeleton key={index} className={s.skeleton} height={128} shape='block' />)}
            {leaders.map((row) => (
              <MarkGainCard key={row.vehicle.tankId} row={row} />
            ))}
          </div>
        </div>
      )}
      <DataSourceNote updatedAt={updatedAt} />
    </Band>
  );
};
