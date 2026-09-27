'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { RecentPlayer } from '@/entities/player/recent-players';
import type { TableColumn } from '@/ui-kit';

import { PlayerNameCell } from '@/entities/player/player';
import { RatingValue, scaledRating } from '@/entities/player/stats';
import { RelativeTime } from '@/ui-kit';

const column = createColumnHelper<RecentPlayer>();

export const useRecentColumns = (): TableColumn<RecentPlayer>[] => {
  const t = useTranslations('players.columns');
  const tCommon = useTranslations('common');

  return [
    column.accessor('nickname', {
      header: t('player'),
      enableSorting: false,
      cell: ({ row: { original } }) => <PlayerNameCell clanTag={original.clanTag} nickname={original.nickname} />,
      meta: { isSticky: true }
    }),
    column.accessor('wn8', {
      header: tCommon('ratings.wn8'),
      enableSorting: false,
      cell: (info) => <RatingValue rating={scaledRating({ scale: 'wn8', value: info.getValue() })} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('viewedAt', {
      header: t('viewed'),
      enableSorting: false,
      cell: (info) => <RelativeTime value={info.getValue()} />,
      meta: { align: 'end' }
    })
  ];
};
