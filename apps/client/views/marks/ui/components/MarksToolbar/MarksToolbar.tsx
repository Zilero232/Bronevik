'use client';

import type { MoeSortField } from '@bronevik/schemas';

import { moeSortFieldSchema } from '@bronevik/schemas';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { IconButton, Input, Select } from '@/ui-kit';

import { useMarksUrlState } from '../../../model/hooks';

import s from './MarksToolbar.module.scss';

export const MarksToolbar = () => {
  const t = useTranslations('marks.toolbar');
  const [{ sort, order, q }, setState] = useMarksUrlState();

  const isDesc = order === 'desc';

  return (
    <div className={s.root}>
      <VehicleFilters withPremium />
      <div className={s.row}>
        <Input
          aria-label={t('search')}
          icon={<Search size={16} />}
          placeholder={t('searchPlaceholder')}
          type='search'
          value={q}
          wrapperClassName={s.search}
          onChange={(event) => setState({ q: event.target.value || null })}
        />
        <div className={s.sort}>
          <Select<MoeSortField>
            className={s.select}
            items={moeSortFieldSchema.options.map((field) => ({ value: field, label: t(`sortFields.${field}`) }))}
            label={t('sort')}
            value={sort}
            onValueChange={(value) => setState({ sort: value })}
          />
          <IconButton
            aria-label={isDesc ? t('order.desc') : t('order.asc')}
            title={isDesc ? t('order.desc') : t('order.asc')}
            variant='outline'
            onClick={() => setState({ order: isDesc ? 'asc' : 'desc' })}
          >
            {isDesc ? <ArrowDownWideNarrow size={16} /> : <ArrowUpNarrowWide size={16} />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};
