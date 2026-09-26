'use client';

import type { PopularPlayer } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerCell, RankCell, Wn8Cell } from '../../../ui/components/PopularPlayers/components';

const column = createColumnHelper<PopularPlayer>();

export const usePopularColumns = (): ColumnDef<PopularPlayer, never>[] => {
  const t = useTranslations('players.columns');
  const format = useFormatter();

  return [
    column.display({
      id: 'rank',
      header: '#',
      cell: ({ row }) => <RankCell rank={row.index + 1} />,
      meta: { width: 48, align: 'end', isNumeric: true }
    }),
    column.accessor('nickname', {
      header: t('player'),
      enableSorting: false,
      cell: ({ row: { original } }) => <PlayerCell clanTag={original.clanTag} nickname={original.nickname} />,
      meta: { isSticky: true }
    }),
    column.accessor('views', {
      header: t('views'),
      cell: (info) => format.number(info.getValue(), 'integer'),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8.value, {
      id: 'wn8',
      header: 'WN8',
      cell: (info) => <Wn8Cell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
