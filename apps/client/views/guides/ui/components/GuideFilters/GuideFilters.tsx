'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { GuideSort } from '@/shared/api/guides';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, SegmentedControl, Select } from '@/ui-kit';

import type { GuideKindFilter } from '../../../model/hooks';

import { useGuideFilterPanel } from '../../../model/hooks';

import s from './GuideFilters.module.scss';

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
    hasFilters,
    setKind,
    setSort,
    onTankChange,
    onMapChange,
    reset
  } = useGuideFilterPanel();

  return (
    <div className={s.root}>
      <SegmentedControl<GuideKindFilter> aria-label={t('kind')} options={kindOptions} size='sm' value={kind} onChange={setKind} />
      {isTankShown && <TankPicker className={s.picker} placeholder={t('tank')} value={tank} onChange={onTankChange} />}
      {isMapShown && <Select className={s.picker} items={mapItems} value={map} onValueChange={onMapChange} />}
      <Select<GuideSort> className={s.sort} items={sortItems} value={sort} onValueChange={setSort} />
      {hasFilters && (
        <Button size='sm' variant='ghost' onClick={reset}>
          <X size={14} />
          {t('reset')}
        </Button>
      )}
    </div>
  );
};
