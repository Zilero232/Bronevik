'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { percentText } from '@/shared/lib';

import type { MedalRow } from '../../achievements.types';

import { MedalCell } from '../../../ui/components/MedalsTab/components';
import { RarityBadge } from '../../../ui/components/RarityBadge';

const column = createColumnHelper<MedalRow>();

export const useMedalColumns = (): TableColumn<MedalRow>[] => {
  const t = useTranslations('achievements.medals.columns');
  const format = useFormatter();

  return [
    column.accessor('title', { header: t('medal'), cell: ({ row: { original } }) => <MedalCell medal={original} />, meta: { isMedia: true } }),
    column.accessor('points', {
      header: t('points'),
      cell: (info) => (info.getValue() === null ? '—' : format.number(info.getValue() ?? 0)),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor('holders', {
      header: t('holders'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('share', {
      header: t('share'),
      cell: (info) => percentText({ format, value: info.getValue(), digits: 2 }),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('tier', { header: t('tier'), cell: (info) => <RarityBadge tier={info.getValue()} />, meta: { align: 'end' } })
  ];
};
