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
  const { query, search, onSearchChange } = useVehicleCatalogPage();

  return (
    <div aria-label={t('label')} className={s.root} role='search'>
      <div className={s.row}>
        <Input
          aria-label={t('search')}
          icon={<Search size={VEHICLE_CATALOG_VIEW.searchIcon} />}
          placeholder={t('searchPlaceholder')}
          size='sm'
          type='search'
          value={search}
          wrapperClassName={s.search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {query.data && (
          <span aria-live='polite' className={s.shown}>
            {t('shown', { shown: query.data.shown, total: query.data.total })}
          </span>
        )}
      </div>
      <VehicleFilters className={s.filters} />
    </div>
  );
};
