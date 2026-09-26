'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Button, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { CATALOG_TABLE } from '../../../config';
import { useCatalogTable } from '../../../model/hooks';
import { CatalogCard } from './components';

export const CatalogTable = () => {
  const t = useTranslations('buildsCatalog.table');
  const { columns, rows, isLoading, isError, isFetching, isFiltered, onReset, onRetry } = useCatalogTable();

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
      getRowLink={(row) => ({ href: ROUTES.builds.detail(row.vehicle.slug), label: row.vehicle.name })}
      initialSorting={[{ id: 'battles', desc: true }]}
      isLoading={isLoading}
      renderCard={(row) => <CatalogCard entry={row} />}
      rowHeight={CATALOG_TABLE.rowHeight}
    />
  );
};
