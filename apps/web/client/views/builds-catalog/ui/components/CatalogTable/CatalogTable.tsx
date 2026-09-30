'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, FilteredEmptyState, QueryState } from '@/ui-kit';

import { CATALOG_TABLE } from '../../../config';
import { useCatalogTable } from '../../../model/hooks';
import { CatalogCard } from './components';

export const CatalogTable = () => {
  const t = useTranslations('buildsCatalog.table');
  const { columns, query, isFiltered, onReset } = useCatalogTable();

  return (
    <QueryState
      skeleton={
        <DataTable
          isLoading
          caption={t('caption', { count: 0 })}
          columns={columns}
          data={[]}
          renderCard={(row) => <CatalogCard entry={row} />}
          rowHeight={CATALOG_TABLE.rowHeight}
        />
      }
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
    >
      {({ entries }) => (
        <DataTable
          emptyState={
            <FilteredEmptyState
              description={isFiltered ? undefined : t('noDataDescription')}
              isFiltered={isFiltered}
              title={isFiltered ? t('emptyTitle') : t('noDataTitle')}
              onReset={onReset}
            />
          }
          caption={t('caption', { count: entries.length })}
          columns={columns}
          data={entries}
          getRowId={(row) => String(row.vehicle.tankId)}
          getRowLink={(row) => ({ href: ROUTES.builds.detail(row.vehicle.slug), label: row.vehicle.name })}
          initialSorting={[{ id: 'battles', desc: true }]}
          renderCard={(row) => <CatalogCard entry={row} />}
          rowHeight={CATALOG_TABLE.rowHeight}
        />
      )}
    </QueryState>
  );
};
