'use client';

import { useTranslations } from 'next-intl';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';
import { Button, DataTable, EmptyState } from '@/ui-kit';

import { useTankColumns, useTankStats } from '../../../model/hooks';

export const StatsTable = () => {
  const t = useTranslations('tanks.table');
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useTankStats();
  const { reset, isActive } = useVehicleFilters();
  const columns = useTankColumns();

  if (isError) {
    return (
      <EmptyState
        action={<Button onClick={() => refetch()}>{t('retry')}</Button>}
        code='ERR'
        description={t('errorDescription')}
        title={t('errorTitle')}
      />
    );
  }

  return (
    <DataTable
      emptyState={
        isActive ? (
          <EmptyState
            action={
              <Button variant='secondary' onClick={reset}>
                {t('resetFilters')}
              </Button>
            }
            description={t('emptyDescription')}
            title={t('emptyTitle')}
          />
        ) : (
          <EmptyState description={t('noStatsDescription')} title={t('noStatsTitle')} />
        )
      }
      caption={t('caption', { count: data?.total ?? 0 })}
      columns={columns}
      data={data?.items ?? []}
      getRowId={(row) => String(row.vehicle.tankId)}
      initialSorting={[{ id: 'battles', desc: true }]}
      isLoading={isLoading}
      onRowClick={(row) => router.push(ROUTES.tank(row.vehicle.slug))}
    />
  );
};
