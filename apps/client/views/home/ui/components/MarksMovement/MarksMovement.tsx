'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DataSourceNote, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { useMarksMovement, useMarksMovementColumns } from '../../../model/hooks';

import s from './MarksMovement.module.scss';

export const MarksMovement = () => {
  const t = useTranslations('home.marks');
  const { rows, updatedAt, isPending, isError, retry } = useMarksMovement();
  const columns = useMarksMovementColumns();

  return (
    <Card padding='none'>
      <CardHeader meta={t('period')} title={t('title')} />
      {isError ? (
        <ErrorState isCompact onRetry={retry} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          density='media'
          emptyState={<EmptyState isCompact title={t('empty')} />}
          getRowId={(row) => String(row.vehicle.tankId)}
          isLoading={isPending}
        />
      )}
      <div className={s.footer}>
        <DataSourceNote updatedAt={updatedAt} />
        <Link className={s.more} href={ROUTES.marks}>
          {t('all')}
        </Link>
      </div>
    </Card>
  );
};
