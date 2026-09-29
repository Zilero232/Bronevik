'use client';

import type { MoeSortField } from '@otmetki/schemas';

import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { FilterField, IconButton, Input, Select } from '@/ui-kit';

import { useMarksToolbar } from '../../../model/hooks';
import { MarksPresets } from './components';

import s from './MarksToolbar.module.scss';

export const MarksToolbar = () => {
  const t = useTranslations('marks.toolbar');
  const tPresets = useTranslations('marks.presets');
  const { q, sort, isDesc, orderLabel, sortItems, searchActive, onSearchChange, onSearchReset, onSortChange, onOrderToggle } = useMarksToolbar();

  return (
    <VehicleFilters
      primary={
        <>
          <Input
            aria-label={t('search')}
            icon={<Search size={16} />}
            placeholder={t('searchPlaceholder')}
            type='search'
            value={q}
            wrapperClassName={s.search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <div className={s.sort}>
            <Select<MoeSortField> aria-label={t('sort')} className={s.select} items={sortItems} value={sort} onValueChange={onSortChange} />
            <IconButton aria-label={orderLabel} title={orderLabel} variant='outline' onClick={onOrderToggle}>
              {isDesc ? <ArrowDownWideNarrow size={16} /> : <ArrowUpNarrowWide size={16} />}
            </IconButton>
          </div>
        </>
      }
      extraActive={searchActive}
      onExtraReset={onSearchReset}
    >
      <FilterField label={tPresets('label')}>
        <MarksPresets />
      </FilterField>
    </VehicleFilters>
  );
};
