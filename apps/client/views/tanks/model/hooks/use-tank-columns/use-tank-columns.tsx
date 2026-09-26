'use client';

import type { TankServerStatsRow } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell, WinRateCell } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';

import { TANKS_TABLE } from '../../../config';
import { PopularityCell, RankCell, TierCell, WrDiffCell } from '../../../ui/components/StatsTable/components';

const column = createColumnHelper<TankServerStatsRow>();

export const useTankColumns = (): ColumnDef<TankServerStatsRow, never>[] => {
  const t = useTranslations('tanks.table');
  const format = useFormatter();

  const decimal = (value: number) => format.number(value, { maximumFractionDigits: 2 });

  return [
    column.display({
      id: 'rank',
      header: '#',
      cell: (info) => <RankCell row={info.row} table={info.table} />,
      meta: { ...TANKS_TABLE.numeric, width: TANKS_TABLE.rankWidth }
    }),
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankCell vehicle={info.row.original.vehicle} />,
      meta: { width: TANKS_TABLE.tankWidth }
    }),
    column.accessor((row) => row.vehicle.tier, {
      id: 'tier',
      header: t('tier'),
      cell: (info) => <TierCell tier={info.getValue()} />,
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('winRate', { header: t('winRate'), cell: (info) => <WinRateCell value={info.getValue()} />, meta: TANKS_TABLE.numeric }),
    column.accessor('winRateDiff', { header: t('winRateDiff'), cell: (info) => <WrDiffCell value={info.getValue()} />, meta: TANKS_TABLE.numeric }),
    column.accessor('avgDamage', {
      header: t('avgDamage'),
      cell: (info) => format.number(info.getValue(), { maximumFractionDigits: 0 }),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('avgFrags', { header: t('frags'), cell: (info) => decimal(info.getValue()), meta: TANKS_TABLE.numeric }),
    column.accessor('avgSpotted', { header: t('spotted'), cell: (info) => decimal(info.getValue()), meta: TANKS_TABLE.numeric }),
    column.accessor('survivalRate', {
      header: t('survival'),
      cell: (info) => percentText({ format, value: info.getValue() }),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor('battles', {
      header: t('battles'),
      cell: (info) => <PopularityCell battles={info.getValue()} rank={info.row.original.popularityRank} />,
      meta: TANKS_TABLE.numeric
    })
  ];
};
