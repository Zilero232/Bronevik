'use client';

import { useMapsCatalog } from '../model/hooks';
import { MapFilters, MapGrid, MapsHero } from './components';

import s from './MapsPage.module.scss';

export const MapsPage = () => {
  const { filters, maps, total, isFiltered, isPending, isError, setFilters, reset, retry } = useMapsCatalog();

  return (
    <div className={s.root}>
      <MapsHero total={total} />
      <div className={s.body}>
        <MapFilters filters={filters} isFiltered={isFiltered} shown={maps.length} total={total} onChange={setFilters} onReset={reset} />
        <MapGrid isError={isError} isFiltered={isFiltered} isPending={isPending} maps={maps} onReset={reset} onRetry={retry} />
      </div>
    </div>
  );
};
