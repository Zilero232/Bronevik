'use client';

import type { TankServerStatsRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ratingTone } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

const column = createColumnHelper<TankServerStatsRow>();

export const useTankColumns = (): ColumnDef<TankServerStatsRow, never>[] => {
  const t = useTranslations('stats');
  const format = useFormatter();

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankIdentity image='contour' tank={vehicleIdentity(info.row.original.vehicle)} />,
      meta: { width: '40%' }
    }),
    column.accessor((row) => row.vehicle.tier, { id: 'tier', header: t('tier'), meta: { align: 'end', isNumeric: true } }),
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
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => format.number(info.getValue(), { notation: 'compact' }),
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
