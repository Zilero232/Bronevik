'use client';

import type { ClanListItem } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { WinRateCell } from '@/entities/tank/tank';

import { ClanCell, Wn8Cell } from '../../../ui/components/ClanRating/components';

const column = createColumnHelper<ClanListItem>();

export const useClanColumns = (): ColumnDef<ClanListItem, never>[] => {
  const t = useTranslations('clans.rating');
  const format = useFormatter();

  const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value));

  return [
    column.display({
      id: 'rank',
      header: '#',
      cell: ({ row }) => row.index + 1,
      meta: { width: 48, align: 'end', isNumeric: true }
    }),
    column.accessor('clan.tag', {
      header: t('columns.clan'),
      enableSorting: false,
      cell: ({ row: { original } }) => <ClanCell clan={original.clan} />
    }),
    column.accessor('clan.name', {
      header: t('columns.name'),
      enableSorting: false
    }),
    column.accessor('clan.membersCount', {
      header: t('columns.members'),
      enableSorting: false,
      cell: ({ row: { original } }) =>
        original.activeMembers7d === null
          ? format.number(original.clan.membersCount)
          : t('active', { active: original.activeMembers7d, total: original.clan.membersCount }),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('avgWn8', {
      header: t('columns.wn8'),
      enableSorting: false,
      cell: (info) => <Wn8Cell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('avgWinRate', {
      header: t('columns.winRate'),
      enableSorting: false,
      cell: (info) => <WinRateCell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('strongholdLevel', {
      header: t('columns.stronghold'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('eloRating10', {
      header: t('columns.elo'),
      enableSorting: false,
      cell: (info) => numberOrDash(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
