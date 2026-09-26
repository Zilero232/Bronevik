'use client';

import type { ClanListItem } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { RatingValue } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';

import { ActivityCell, ClanCell } from '../../../ui/components/ClanRating/components';

const column = createColumnHelper<ClanListItem>();

export const useClanColumns = (): ColumnDef<ClanListItem, never>[] => {
  const t = useTranslations('clans.rating');
  const format = useFormatter();

  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));

  return [
    column.accessor((_, index) => index + 1, {
      id: 'rank',
      header: '#',
      enableSorting: false,
      meta: { width: 48, align: 'end', isRank: true }
    }),
    column.accessor('clan.tag', {
      header: t('columns.clan'),
      enableSorting: false,
      cell: ({ row: { original } }) => <ClanCell clan={original.clan} />
    }),
    column.accessor('clan.name', {
      header: t('columns.name'),
      enableSorting: false,
      meta: { hideBelow: 'md' }
    }),
    column.accessor('clan.membersCount', {
      header: t('columns.members'),
      enableSorting: false,
      cell: ({ row: { original } }) => <ActivityCell item={original} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    }),
    column.accessor('avgWn8', {
      header: t('columns.wn8'),
      enableSorting: false,
      cell: (info) => <RatingValue rating={info.getValue()} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('avgWinRate', {
      header: t('columns.winRate'),
      enableSorting: false,
      cell: (info) => <WinRateCell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('strongholdLevel', {
      header: t('columns.stronghold'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    }),
    column.accessor('eloRating10', {
      header: t('columns.elo'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    })
  ];
};
