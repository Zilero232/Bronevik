'use client';

import { useTranslations } from 'next-intl';

import type { GuideSort } from '@/entities/guide/guide';

import { TankPicker } from '@/features/tank/pick-tank';
import { FilterBar, FilterField, SegmentedControl, Select } from '@/ui-kit';

import type { GuideKindFilter } from '../../../model/hooks';

import { useGuideFilterPanel } from '../../../model/hooks';

export const GuideFilters = () => {
  const t = useTranslations('guides.list.filters');
  const {
    kind,
    kindOptions,
    sort,
    sortItems,
    tank,
    map,
    mapItems,
    isTankShown,
    isMapShown,
    activeCount,
    setKind,
    setSort,
    onTankChange,
    onMapChange,
    reset
  } = useGuideFilterPanel();

  return (
    <FilterBar activeCount={activeCount} onReset={reset}>
      <FilterField label={t('kind')}>
        <SegmentedControl<GuideKindFilter> aria-label={t('kind')} options={kindOptions} value={kind} onChange={setKind} />
      </FilterField>
      {isTankShown && (
        <FilterField label={t('tankLabel')} size='lg'>
          <TankPicker placeholder={t('tank')} value={tank} onChange={onTankChange} />
        </FilterField>
      )}
      {isMapShown && (
        <FilterField label={t('map')} size='lg'>
          <Select items={mapItems} value={map} onValueChange={onMapChange} />
        </FilterField>
      )}
      <FilterField label={t('sort')} size='md'>
        <Select<GuideSort> items={sortItems} value={sort} onValueChange={setSort} />
      </FilterField>
    </FilterBar>
  );
};
