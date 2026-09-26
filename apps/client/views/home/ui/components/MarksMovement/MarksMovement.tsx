'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Band, Card, DataSourceNote, DataTable, EmptyState, ErrorState, SectionHeader, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useMarksMovement, useMarksMovementColumns } from '../../../model/hooks';

import s from './MarksMovement.module.scss';

export const MarksMovement = () => {
  const t = useTranslations('home.marks');
  const format = useFormatter();
  const { rows, leaders, updatedAt, isPending, isError, retry } = useMarksMovement();
  const columns = useMarksMovementColumns();

  return (
    <Band aria-labelledby='home-marks' innerClassName={s.inner}>
      <SectionHeader id='home-marks' meta={t('period')} more={{ href: ROUTES.marks, label: t('all') }} title={t('title')} variant='display' />
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
              <TankShowcaseCard
                key={row.vehicle.tankId}
                figures={[
                  {
                    id: 'p95',
                    label: t('threeMarks'),
                    value: row.moe ? format.number(row.moe.p95) : '—',
                    delta: row.trend.p95Delta30d,
                    isDeltaLowerBetter: true
                  },
                  { id: 'p65', label: t('oneMark'), value: row.moe ? format.number(row.moe.p65) : '—' },
                  { id: 'p85', label: t('twoMarks'), value: row.moe ? format.number(row.moe.p85) : '—' }
                ]}
                layout='row'
                vehicle={row.vehicle}
              />
            ))}
          </div>
        </div>
      )}
      <DataSourceNote updatedAt={updatedAt} />
    </Band>
  );
};
