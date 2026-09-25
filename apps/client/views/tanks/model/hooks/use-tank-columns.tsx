'use client';

import type { TankServerStatsRow } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { percentText, ratingTone } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import { PopularityCell, WrDiffCell } from '../../ui/components';

const column = createColumnHelper<TankServerStatsRow>();

export const useTankColumns = (): ColumnDef<TankServerStatsRow, never>[] => {
  const t = useTranslations('tanks.table');
  const format = useFormatter();

  const percent = (value: number) => percentText({ format, value });
  const decimal = (value: number) => format.number(value, { maximumFractionDigits: 2 });

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankIdentity image='contour' tank={vehicleIdentity(info.row.original.vehicle)} />,
      meta: { width: '30%' }
    }),
    column.accessor((row) => row.vehicle.tier, { id: 'tier', header: t('tier'), meta: { align: 'end', isNumeric: true } }),
    column.accessor('winRate', {
      header: t('winRate'),
      cell: (info) => (
        <RatingBadge size='sm' tone={ratingTone({ scale: 'winRate', value: info.getValue() })} value={percent(info.getValue())} withPips={false} />
      ),
      meta: { align: 'end' }
    }),
    column.accessor('winRateDiff', { header: t('winRateDiff'), cell: (info) => <WrDiffCell value={info.getValue()} />, meta: { align: 'end' } }),
    column.accessor('avgDamage', { header: t('avgDamage'), cell: (info) => format.number(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('avgFrags', { header: t('frags'), cell: (info) => decimal(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('avgSpotted', { header: t('spotted'), cell: (info) => decimal(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('survivalRate', { header: t('survival'), cell: (info) => percent(info.getValue()), meta: { align: 'end', isNumeric: true } }),
    column.accessor('battles', {
      header: t('popularity'),
      cell: (info) => <PopularityCell battles={info.getValue()} rank={info.row.original.popularityRank} />,
      meta: { align: 'end' }
    })
  ];
};
