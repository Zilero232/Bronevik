'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import { MAP_CAMOUFLAGES, MAP_MODE_KINDS, MAP_MODE_PREFIXES, ModeIcon } from '@/entities/map/map';
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
        type='search'
        value={q}
        wrapperClassName={s.search}
        onChange={(event) => onChange({ q: event.target.value })}
      />
      <div className={s.group}>
        <span className={s.label}>{t('filters.modes')}</span>
        <ToggleChips<MapModeKind>
          options={MAP_MODE_KINDS.map((value) => ({
            value,
            label: t(`modes.${value}`),
            icon: <ModeIcon mode={MAP_MODE_PREFIXES[value]} size={14} />
          }))}
          aria-label={t('filters.modes')}
          size='sm'
          value={modes}
          onChange={(next) => onChange({ modes: next })}
        />
      </div>
      <div className={s.group}>
        <span className={s.label}>{t('filters.camouflage')}</span>
        <ToggleChips<MapCamouflage>
          aria-label={t('filters.camouflage')}
          options={MAP_CAMOUFLAGES.map((value) => ({ value, label: t(`camouflage.${value}`) }))}
          size='sm'
          value={camo}
          onChange={(next) => onChange({ camo: next })}
        />
      </div>
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
