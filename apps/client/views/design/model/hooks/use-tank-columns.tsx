'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TankStats } from '@/entities/tank/tank';

import { TankIdentity } from '@/entities/tank/tank';
import { ratingTone } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

const column = createColumnHelper<TankStats>();

export const useTankColumns = (): ColumnDef<TankStats, never>[] => {
  const t = useTranslations('stats');
  const format = useFormatter();

  return [
    column.accessor('name', {
      header: t('tank'),
      cell: (info) => <TankIdentity image='contour' tank={info.row.original} />,
      meta: { width: '40%' }
    }),
    column.accessor('tier', { header: t('tier'), meta: { align: 'end', isNumeric: true } }),
    column.accessor('winRate', {
      header: t('winRate'),
      cell: (info) => (
        <RatingBadge
          size='sm'
          tone={ratingTone({ scale: 'winRate', value: info.getValue() })}
          value={`${format.number(info.getValue(), { maximumFractionDigits: 2 })}%`}
          withPips={false}
        />
      ),
      meta: { align: 'end' }
    }),
    column.accessor('avgDamage', { header: t('avgDamage'), cell: (info) => format.number(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('moe3', { header: t('moe3'), cell: (info) => format.number(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue(), { notation: 'compact' }),
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
