'use client';

import type { MoeSortField } from '@otmetki/schemas';

import { moeSortFieldSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { useMarksUrlState } from '../use-marks-url-state';

export const useMarksToolbar = () => {
  const t = useTranslations('marks.toolbar');
  const tFilters = useTranslations('common.filters');
  const [{ sort, order, q }, setState] = useMarksUrlState();

  const isDesc = order === 'desc';
  const searchActive: ActiveFilter[] = q
    ? [{ id: 'q', label: tFilters('span', { label: t('search'), value: q }), onRemove: () => void setState({ q: null }) }]
    : [];

  return {
    q,
    sort,
    isDesc,
    orderLabel: isDesc ? t('order.desc') : t('order.asc'),
    sortItems: moeSortFieldSchema.options.map((field) => ({ value: field, label: t(`sortFields.${field}`) })),
    searchActive,
    onSearchChange: (value: string) => void setState({ q: value || null }),
    onSearchReset: () => void setState({ q: null }),
    onSortChange: (value: MoeSortField) => void setState({ sort: value }),
    onOrderToggle: () => void setState({ order: isDesc ? 'asc' : 'desc' })
  };
};
