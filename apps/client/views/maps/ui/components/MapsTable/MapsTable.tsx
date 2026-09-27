'use client';

import { useTranslations } from 'next-intl';

import { DataTable, ErrorState, FilteredEmptyState } from '@/ui-kit';

import { useMapsCatalog, useMapsColumns } from '../../../model/hooks';

export const MapsTable = () => {
  const t = useTranslations('maps.grid');
  const { maps, isFiltered, isPending, isError, isRetrying, onReset, retry } = useMapsCatalog();
  const columns = useMapsColumns();

  if (isError) {
    return <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />;
  }

  return (
    <DataTable
      columns={columns}
      data={maps}
      emptyState={<FilteredEmptyState isCompact isFiltered={isFiltered} title={isFiltered ? t('noMatchTitle') : t('emptyTitle')} onReset={onReset} />}
      getRowId={(map) => map.arenaId}
      initialSorting={[{ id: 'name', desc: false }]}
      isLoading={isPending}
    />
  );
};
