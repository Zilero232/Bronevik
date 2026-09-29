'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { vehicleCatalogQuery } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { filterCatalog, groupByTier } from '../../../lib/catalog-filter';
import { useCatalogSearch } from '../use-catalog-search';

export const useVehicleCatalogPage = () => {
  const t = useTranslations('vehicleCatalog.filters');
  const tFilters = useTranslations('common.filters');
  const { filters, isActive, reset } = useVehicleFilters();
  const { search, onSearchChange, resetSearch } = useCatalogSearch();

  const query = useQuery({
    ...vehicleCatalogQuery(),
    select: (catalog) => {
      const vehicles = filterCatalog({ catalog, filters, search });

      return { groups: groupByTier(vehicles), shown: vehicles.length, total: catalog.length };
    }
  });

  const searchActive: ActiveFilter[] =
    search.length > 0 ? [{ id: 'search', label: tFilters('span', { label: t('search'), value: search }), onRemove: resetSearch }] : [];

  return {
    query,
    search,
    searchActive,
    onSearchReset: resetSearch,
    isFiltered: isActive || search.length > 0,
    onSearchChange,
    onReset: () => {
      void reset();
      resetSearch();
    }
  };
};
