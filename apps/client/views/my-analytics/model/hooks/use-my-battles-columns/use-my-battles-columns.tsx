'use client';

import type { MyBattle } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell } from '@/entities/tank/tank';
import { NumberCell } from '@/ui-kit';

import { MoeCell, ResultCell } from '../../../ui/components/BattlesTab/components';
import { DateCell } from '../../../ui/components/SessionsTable/components';

const column = createColumnHelper<MyBattle>();

export const useMyBattlesColumns = (): TableColumn<MyBattle>[] => {
  const t = useTranslations('analytics.columns');

  return [
    column.accessor((row) => Date.parse(row.startedAt), {
      id: 'startedAt',
      header: t('startedAt'),
      cell: ({ row }) => <DateCell withTime value={row.original.startedAt} />
    }),
    column.accessor((row) => row.vehicle?.name ?? String(row.tankId), {
      id: 'tank',
      header: t('tank'),
      cell: ({ row }) => (row.original.vehicle ? <TankCell vehicle={row.original.vehicle} /> : row.original.tankId)
    }),
    column.accessor((row) => row.mapName ?? row.arenaId, {
      id: 'map',
      header: t('map'),
      meta: { hideBelow: 'md' }
    }),
    column.accessor('result', {
      header: t('result'),
      cell: ({ row }) => <ResultCell result={row.original.result} survived={row.original.survived} />
    }),
    column.accessor('damageDealt', {
      header: t('damage'),
      cell: ({ row }) => <NumberCell value={row.original.damageDealt} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('damageAssisted', {
      header: t('assisted'),
      cell: ({ row }) => <NumberCell value={row.original.damageAssisted} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor('frags', {
      header: t('frags'),
      cell: ({ row }) => <NumberCell value={row.original.frags} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor((row) => row.moePercent ?? -1, {
      id: 'moe',
      header: t('moe'),
      cell: ({ row }) => <MoeCell delta={row.original.moePercentDelta} percent={row.original.moePercent} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
