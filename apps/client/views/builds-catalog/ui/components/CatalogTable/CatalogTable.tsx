'use client';

import { useTranslations } from 'next-intl';

import { Button, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { CATALOG_TABLE } from '../../../config';
import { useCatalogTable } from '../../../model/hooks';

export const CatalogTable = () => {
  const t = useTranslations('buildsCatalog.table');
  const { columns, rows, isLoading, isError, isFetching, isFiltered, onReset, onRetry, onRowClick } = useCatalogTable();

  if (isError) {
    return <ErrorState description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />;
  }

  return (
    <DataTable
      emptyState={
        <EmptyState
          action={
            isFiltered ? (
              <Button size='sm' variant='secondary' onClick={onReset}>
                {t('resetFilters')}
              </Button>
            ) : undefined
          }
          title={t('emptyTitle')}
        />
      }
      caption={t('caption', { count: rows.length })}
      columns={columns}
      data={rows}
      getRowId={(row) => String(row.vehicle.tankId)}
      initialSorting={[{ id: 'battles', desc: true }]}
      isLoading={isLoading}
      rowHeight={CATALOG_TABLE.rowHeight}
      onRowClick={onRowClick}
    />
  );
};
