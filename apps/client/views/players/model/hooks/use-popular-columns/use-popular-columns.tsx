'use client';

import type { PopularPlayer } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerNameCell, PlayerRankCell } from '@/entities/player/player';
import { RatingValue } from '@/entities/player/stats';

const column = createColumnHelper<PopularPlayer>();

export const usePopularColumns = (): ColumnDef<PopularPlayer, never>[] => {
  const t = useTranslations('players.columns');
  const format = useFormatter();

  return [
    column.display({
      id: 'rank',
      header: '#',
      cell: ({ row }) => <PlayerRankCell rank={row.index + 1} />,
      meta: { width: 48, align: 'end', isNumeric: true }
    }),
    column.accessor('nickname', {
      header: t('player'),
      enableSorting: false,
      cell: ({ row: { original } }) => <PlayerNameCell clanTag={original.clanTag} nickname={original.nickname} />,
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
      cell: (info) => <RatingValue rating={info.row.original.wn8} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
