'use client';

import { useTranslations } from 'next-intl';

import { TankCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { DataTable, FilteredEmptyState, QueryState } from '@/ui-kit';

import { TANKS_VIEW } from '../../../config';
import { useStatsTable } from '../../../model/hooks';

export const StatsTable = () => {
  const t = useTranslations('tanks.table');
  const { columns, query, isFiltered, onReset } = useStatsTable();

  return (
    <QueryState
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
      skeleton={<DataTable isLoading caption={t('caption', { count: 0 })} columns={columns} data={[]} rowHeight={TANKS_VIEW.rowHeight} />}
    >
      {({ items, total }) => (
        <DataTable
          caption={t('caption', { count: total })}
          columns={columns}
          data={items}
          emptyState={<FilteredEmptyState isFiltered={isFiltered} title={isFiltered ? t('emptyTitle') : t('noStatsTitle')} onReset={onReset} />}
          getRowId={(row) => String(row.vehicle.tankId)}
          getRowLink={(row) => ({ href: ROUTES.tanks.detail(row.vehicle.slug), label: row.vehicle.name })}
          initialSorting={[{ id: 'battles', desc: true }]}
          renderCard={(row) => <TankCard row={row} />}
          rowHeight={TANKS_VIEW.rowHeight}
        />
      )}
    </QueryState>
  );
};
