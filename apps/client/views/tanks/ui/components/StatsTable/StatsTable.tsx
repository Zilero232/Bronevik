'use client';

import { useTranslations } from 'next-intl';

import { TankCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Button, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { TANKS_VIEW } from '../../../config';
import { useStatsTable } from '../../../model/hooks';

export const StatsTable = () => {
  const t = useTranslations('tanks.table');
  const { columns, rows, total, isLoading, isError, isFetching, isFiltered, onReset, onRetry } = useStatsTable();

  if (isError) {
    return <ErrorState description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />;
  }

  return (
    <DataTable
      emptyState={
        isFiltered ? (
          <EmptyState
            action={
              <Button size='sm' variant='secondary' onClick={onReset}>
                {t('resetFilters')}
              </Button>
            }
            title={t('emptyTitle')}
          />
        ) : (
          <EmptyState title={t('noStatsTitle')} />
        )
      }
      caption={t('caption', { count: total })}
      columns={columns}
      data={rows}
      getRowId={(row) => String(row.vehicle.tankId)}
      getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
      initialSorting={[{ id: 'battles', desc: true }]}
      isLoading={isLoading}
      renderCard={(row) => <TankCard row={row} />}
      rowHeight={TANKS_VIEW.rowHeight}
    />
  );
};
