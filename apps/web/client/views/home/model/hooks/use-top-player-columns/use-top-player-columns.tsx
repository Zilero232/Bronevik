'use client';

import type { LeaderboardEntry } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { PlayerNameCell } from '@/entities/player/player';
import { NumberCell } from '@/ui-kit';

import type { TopPlayersMetric } from '../use-top-players';

import { MetricCell } from '../../../ui/components/TopPlayers/components';

const column = createColumnHelper<LeaderboardEntry>();

export const useTopPlayerColumns = (metric: TopPlayersMetric): TableColumn<LeaderboardEntry>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor('rank', { header: '#', enableSorting: false, meta: { align: 'end', isRank: true } }),
    column.accessor('name', {
      header: t('player'),
      enableSorting: false,
      cell: ({ row }) => <PlayerNameCell clanTag={row.original.clanTag} nickname={row.original.name} withAvatar={false} />
    }),
    column.accessor('battles', {
      header: t('battles'),
      enableSorting: false,
      cell: ({ getValue }) => <NumberCell value={getValue()} />,
      meta: { hideBelow: 'sm' }
    }),
    column.accessor('value', { header: t(metric), enableSorting: false, cell: ({ row }) => <MetricCell entry={row.original} /> })
  ];
};
