'use client';

import type { TankEconomyRow } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { economyView, TankCell, TankStatusBadge } from '@/entities/tank/tank';

import type { UseEconomyColumnsInput } from './use-economy-columns.types';

import { TANKS_TABLE } from '../../../config';
import { TierCell } from '../../../ui/components/StatsTable/components';

const column = createColumnHelper<TankEconomyRow>();

export const useEconomyColumns = ({ account, withReserve, withClanPayout }: UseEconomyColumnsInput): ColumnDef<TankEconomyRow, never>[] => {
  const t = useTranslations('tanks.economy.columns');
  const format = useFormatter();

  const view = (row: TankEconomyRow) => economyView({ economy: row.economy, account, withReserve, withClanPayout });
  const amount = (value: number | null | undefined) => (value === null || value === undefined ? '—' : format.number(value));

  return [
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
    column.accessor((row) => row.traits.status, {
      id: 'status',
      header: t('status'),
      cell: (info) => <TankStatusBadge status={info.getValue()} />
    }),
    column.accessor((row) => view(row)?.battles ?? 0, {
      id: 'battles',
      header: t('battles'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor((row) => view(row)?.credits ?? null, {
      id: 'credits',
      header: t('credits'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor((row) => view(row)?.costs ?? null, {
      id: 'costs',
      header: t('costs'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor((row) => view(row)?.net ?? null, {
      id: 'net',
      header: t('net'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor((row) => view(row)?.xp ?? null, {
      id: 'xp',
      header: t('xp'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    }),
    column.accessor((row) => view(row)?.freeXp ?? null, {
      id: 'freeXp',
      header: t('freeXp'),
      cell: (info) => amount(info.getValue()),
      meta: TANKS_TABLE.numeric
    })
  ];
};
