'use client';

import type { ClanListItem } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { NumberCell } from '@/ui-kit';

import { ClanCell } from '../../../ui/components/ClanActivity/components';

const column = createColumnHelper<ClanListItem>();

export const useClanActivityColumns = (): ColumnDef<ClanListItem, never>[] => {
  const t = useTranslations('home.columns');

  return [
    column.accessor((row) => row.clan.tag, {
      id: 'clan',
      header: t('clan'),
      enableSorting: false,
      cell: ({ row }) => <ClanCell clan={row.original.clan} />
    }),
    column.accessor('activeMembers7d', {
      header: t('activeMembers'),
      enableSorting: false,
      cell: ({ getValue }) => <NumberCell value={getValue()} />
    }),
    column.accessor((row) => row.clan.membersCount, {
      id: 'members',
      header: t('members'),
      enableSorting: false,
      cell: ({ getValue }) => <NumberCell value={getValue()} />
    }),
    column.accessor('strongholdLevel', { header: t('stronghold'), enableSorting: false, cell: ({ getValue }) => <NumberCell value={getValue()} /> })
  ];
};
