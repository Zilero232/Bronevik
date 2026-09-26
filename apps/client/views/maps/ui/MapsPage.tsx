'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, ErrorState, PageHeader } from '@/ui-kit';

import { useMapsCatalog } from '../model/hooks';
import { MapFilters, MapsTable } from './components';

import s from './MapsPage.module.scss';

export const MapsPage = () => {
  const t = useTranslations('maps');
  const { filters, maps, total, isFiltered, isPending, isError, isRetrying, setFilters, reset, retry } = useMapsCatalog();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      <MapFilters filters={filters} isFiltered={isFiltered} shown={maps.length} total={total} onChange={setFilters} onReset={reset} />
      {isError ? (
        <ErrorState description={t('grid.errorDescription')} isRetrying={isRetrying} title={t('grid.errorTitle')} onRetry={retry} />
      ) : (
        <MapsTable isFiltered={isFiltered} isPending={isPending} maps={maps} onReset={reset} />
      )}
      <DataSourceNote />
    </div>
  );
};
