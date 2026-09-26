'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS } from '@/entities/map/map';
import { Button, Input, ToggleChips } from '@/ui-kit';

import type { MapFiltersProps } from './MapFilters.types';

import s from './MapFilters.module.scss';

export const MapFilters = ({ filters, shown, total, isFiltered, onChange, onReset }: MapFiltersProps) => {
  const t = useTranslations('maps');

  const { q, modes, camo } = filters;

  return (
    <div className={s.root}>
      <Input
        aria-label={t('filters.search')}
        icon={<Search size={16} />}
        placeholder={t('filters.searchPlaceholder')}
        size='sm'
        type='search'
        value={q}
        wrapperClassName={s.search}
        onChange={(event) => onChange({ q: event.target.value })}
      />
      <ToggleChips<MapModeKind>
        aria-label={t('filters.modes')}
        options={MAP_MODE_KINDS.map((value) => ({ value, label: t(`modes.${value}`) }))}
        size='sm'
        value={modes}
        onChange={(next) => onChange({ modes: next })}
      />
      <ToggleChips<MapCamouflage>
        aria-label={t('filters.camouflage')}
        options={MAP_CAMOUFLAGES.map((value) => ({ value, label: t(`camouflage.${value}`) }))}
        size='sm'
        value={camo}
        onChange={(next) => onChange({ camo: next })}
      />
      <div className={s.status}>
        <span aria-live='polite' className={s.count}>
          {t('filters.shown', { shown, total })}
        </span>
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
