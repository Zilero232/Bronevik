'use client';

import type { LeaderboardEntry } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { PlayerNameCell, PlayerRankCell } from '@/entities/player/player';
import { NumberCell } from '@/ui-kit';

import type { TopPlayersMetric } from '../use-top-players';

import { MetricCell } from '../../../ui/components/TopPlayers/components';

const column = createColumnHelper<LeaderboardEntry>();

export const useTopPlayerColumns = (metric: TopPlayersMetric): ColumnDef<LeaderboardEntry, never>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor('rank', { header: '#', enableSorting: false, cell: ({ getValue }) => <PlayerRankCell rank={getValue()} /> }),
    column.accessor('name', {
      header: t('player'),
      enableSorting: false,
      cell: ({ row }) => <PlayerNameCell clanTag={row.original.clanTag} nickname={row.original.name} withAvatar={false} />
    }),
    column.accessor('battles', { header: t('battles'), enableSorting: false, cell: ({ getValue }) => <NumberCell value={getValue()} /> }),
    column.accessor('value', { header: t(metric), enableSorting: false, cell: ({ row }) => <MetricCell entry={row.original} /> })
  ];
};
