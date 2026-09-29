'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { Input } from '@/ui-kit';

import { VEHICLE_CATALOG_VIEW } from '../../../config';
import { useVehicleCatalogPage } from '../../../model/hooks';

import s from './CatalogFilters.module.scss';

export const CatalogFilters = () => {
  const t = useTranslations('vehicleCatalog.filters');
  const { query, search, searchActive, onSearchChange, onSearchReset } = useVehicleCatalogPage();

  return (
    <VehicleFilters
      actions={
        query.data &&
        query.data.total > 0 && (
          <span aria-live='polite' className={s.shown}>
            {t('shown', { shown: query.data.shown, total: query.data.total })}
          </span>
        )
      }
      primary={
        <Input
          aria-label={t('search')}
          icon={<Search size={VEHICLE_CATALOG_VIEW.searchIcon} />}
          placeholder={t('searchPlaceholder')}
          type='search'
          value={search}
          wrapperClassName={s.search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      }
      extraActive={searchActive}
      label={t('label')}
      onExtraReset={onSearchReset}
    />
  );
};
