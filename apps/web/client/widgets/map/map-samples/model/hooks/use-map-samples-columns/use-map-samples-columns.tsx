'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { PERCENT_TEXT, percentText } from '@/shared/lib';

import type { MapSampleRow, UseMapSamplesColumnsInput } from './use-map-samples-columns.types';

import { SampleNameCell, SampleRateCell } from '../../../ui/components';

const column = createColumnHelper<MapSampleRow>();

export const useMapSamplesColumns = ({ nameLabel, minBattles }: UseMapSamplesColumnsInput): TableColumn<MapSampleRow>[] => {
  const t = useTranslations('maps.samples');
  const format = useFormatter();

  return [
    column.accessor('name', {
      header: () => nameLabel,
      cell: ({ row: { original } }) => <SampleNameCell href={original.href} isEnough={original.isEnough} name={original.name} />,
      meta: { isSticky: true }
    }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => (row.isEnough ? (row.winRate ?? -1) : -1), {
      id: 'winRate',
      header: t('winRate'),
      cell: ({ row: { original } }) => (
        <SampleRateCell
          note={original.isEnough ? null : t('fewBattles', { min: minBattles })}
          value={percentText({ format, value: original.winRate })}
        />
      ),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => (row.isEnough ? (row.avgDamage ?? -1) : -1), {
      id: 'avgDamage',
      header: t('avgDamage'),
      cell: ({ row: { original } }) => (original.isEnough && original.avgDamage !== null ? format.number(original.avgDamage) : PERCENT_TEXT.empty),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    })
  ];
};
