'use client';

import { useTranslations } from 'next-intl';

import { DataTable, FilteredEmptyState, QueryState } from '@/ui-kit';

import { useMapsCatalog, useMapsColumns } from '../../../model/hooks';

export const MapsTable = () => {
  const t = useTranslations('maps.grid');
  const { query, isFiltered, onReset } = useMapsCatalog();
  const columns = useMapsColumns();

  return (
    <QueryState
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
      skeleton={<DataTable isLoading columns={columns} data={[]} />}
    >
      {({ maps }) => (
        <DataTable
          emptyState={
            <FilteredEmptyState isCompact isFiltered={isFiltered} title={isFiltered ? t('noMatchTitle') : t('emptyTitle')} onReset={onReset} />
          }
          caption={t('caption')}
          columns={columns}
          data={maps}
          getRowId={(map) => map.arenaId}
          initialSorting={[{ id: 'name', desc: false }]}
        />
      )}
    </QueryState>
  );
};
