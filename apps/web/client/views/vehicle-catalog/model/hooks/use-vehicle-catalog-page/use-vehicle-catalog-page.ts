'use client';

import { useQuery } from '@tanstack/react-query';

import { vehicleCatalogQuery } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { filterCatalog, groupByTier } from '../../../lib/catalog-filter';
import { useCatalogSearch } from '../use-catalog-search';

export const useVehicleCatalogPage = () => {
  const { filters, isActive, reset } = useVehicleFilters();
  const { search, onSearchChange, resetSearch } = useCatalogSearch();

  const query = useQuery({
    ...vehicleCatalogQuery(),
    select: (catalog) => {
      const vehicles = filterCatalog({ catalog, filters, search });

      return { groups: groupByTier(vehicles), shown: vehicles.length, total: catalog.length };
    }
  });

  return {
    query,
    search,
    isFiltered: isActive || search.length > 0,
    onSearchChange,
    onReset: () => {
      void reset();
      resetSearch();
    }
  };
};
