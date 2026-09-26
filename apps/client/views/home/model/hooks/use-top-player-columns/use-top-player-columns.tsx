'use client';

import type { LeaderboardEntry } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TopPlayersMetric } from '../use-top-players';

import { NumberCell } from '../../../ui/components/NumberCell';
import { MetricCell, PlayerCell, RankCell } from '../../../ui/components/TopPlayers/components';

const column = createColumnHelper<LeaderboardEntry>();

export const useTopPlayerColumns = (metric: TopPlayersMetric): ColumnDef<LeaderboardEntry, never>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor('rank', { header: '#', enableSorting: false, cell: ({ getValue }) => <RankCell rank={getValue()} /> }),
    column.accessor('name', { header: t('player'), enableSorting: false, cell: ({ row }) => <PlayerCell entry={row.original} /> }),
    column.accessor('battles', { header: t('battles'), enableSorting: false, cell: ({ getValue }) => <NumberCell value={getValue()} /> }),
    column.accessor('value', { header: t(metric), enableSorting: false, cell: ({ row }) => <MetricCell entry={row.original} /> })
  ];
};
