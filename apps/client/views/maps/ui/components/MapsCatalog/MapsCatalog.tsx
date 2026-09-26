'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/ui-kit';

import { useMapsCatalog } from '../../../model/hooks';
import { MapFilters } from '../MapFilters';
import { MapsTable } from '../MapsTable';

import s from './MapsCatalog.module.scss';

export const MapsCatalog = () => {
  const t = useTranslations('maps');
  const { filters, maps, total, isFiltered, isPending, isError, isRetrying, setFilters, reset, retry } = useMapsCatalog();

  return (
    <div className={s.root}>
      <MapFilters filters={filters} isFiltered={isFiltered} shown={maps.length} total={total} onChange={setFilters} onReset={reset} />
      {isError ? (
        <ErrorState description={t('grid.errorDescription')} isRetrying={isRetrying} title={t('grid.errorTitle')} onRetry={retry} />
      ) : (
        <MapsTable isFiltered={isFiltered} isPending={isPending} maps={maps} onReset={reset} />
      )}
    </div>
  );
};
