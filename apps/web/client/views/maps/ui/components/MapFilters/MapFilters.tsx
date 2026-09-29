'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';
import { FilterBar, FilterField, Input, ToggleChips } from '@/ui-kit';

import { useMapFilters } from '../../../model/hooks';
import { MapsPresets, MapsShown } from './components';

import s from './MapFilters.module.scss';

export const MapFilters = () => {
  const t = useTranslations('maps');
  const { filters, active, activeCount, onQueryChange, onModesChange, onCamoChange, onReset } = useMapFilters();

  return (
    <FilterBar
      primary={
        <Input
          aria-label={t('filters.search')}
          icon={<Search size={16} />}
          placeholder={t('filters.searchPlaceholder')}
          type='search'
          value={filters.q}
          wrapperClassName={s.search}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      }
      actions={<MapsShown />}
      active={active}
      activeCount={activeCount}
      onReset={onReset}
    >
      <FilterField label={t('presets.label')}>
        <MapsPresets />
      </FilterField>
      <FilterField count={filters.modes.length} label={t('filters.modes')}>
        <ToggleChips<MapModeKind>
          aria-label={t('filters.modes')}
          options={MAP_MODE_KINDS.map((value) => ({ value, label: t(`modes.${value}`) }))}
          value={filters.modes}
          onChange={onModesChange}
        />
      </FilterField>
      <FilterField count={filters.camo.length} label={t('filters.camouflage')}>
        <ToggleChips<MapCamouflage>
          aria-label={t('filters.camouflage')}
          options={MAP_CAMOUFLAGES.map((value) => ({ value, label: t(`camouflage.${value}`) }))}
          value={filters.camo}
          onChange={onCamoChange}
        />
      </FilterField>
    </FilterBar>
  );
};
