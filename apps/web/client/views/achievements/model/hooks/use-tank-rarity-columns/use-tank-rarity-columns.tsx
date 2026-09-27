'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';

import type { TankRarityRow } from '../../achievements.types';

import { RarityBadge } from '../../../ui/components/RarityBadge';

const column = createColumnHelper<TankRarityRow>();

export const useTankRarityColumns = (): TableColumn<TankRarityRow>[] => {
  const t = useTranslations('achievements.tanks.columns');
  const format = useFormatter();

  return [
    column.accessor('vehicle.name', {
      header: t('tank'),
      cell: ({ row: { original } }) => <TankCell vehicle={original.vehicle} />,
      meta: { isMedia: true }
    }),
    column.accessor('owners', {
      header: t('owners'),
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
