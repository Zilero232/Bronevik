'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';
import { Button, Input, ToggleChips } from '@/ui-kit';

import { useMapFilters } from '../../../model/hooks';
import { MapsPresets, MapsShown } from './components';

import s from './MapFilters.module.scss';

export const MapFilters = () => {
  const t = useTranslations('maps');
  const { filters, isFiltered, onQueryChange, onModesChange, onCamoChange, onReset } = useMapFilters();

  return (
    <div className={s.root}>
      <Input
        aria-label={t('filters.search')}
        icon={<Search size={16} />}
        placeholder={t('filters.searchPlaceholder')}
        size='sm'
        type='search'
        value={filters.q}
        wrapperClassName={s.search}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <MapsPresets />
      <ToggleChips<MapModeKind>
        aria-label={t('filters.modes')}
        options={MAP_MODE_KINDS.map((value) => ({ value, label: t(`modes.${value}`) }))}
        size='sm'
        value={filters.modes}
        onChange={onModesChange}
      />
      <ToggleChips<MapCamouflage>
        aria-label={t('filters.camouflage')}
        options={MAP_CAMOUFLAGES.map((value) => ({ value, label: t(`camouflage.${value}`) }))}
        size='sm'
        value={filters.camo}
        onChange={onCamoChange}
      />
      <div className={s.status}>
        <MapsShown />
        {isFiltered && (
          <Button size='sm' variant='ghost' onClick={onReset}>
            <X size={14} />
            {t('filters.reset')}
          </Button>
        )}
      </div>
    </div>
  );
};
