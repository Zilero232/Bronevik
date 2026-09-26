'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { clanRoleSchema } from '@otmetki/schemas';
import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerNameCell } from '@/entities/player/player';
import { RatingValue } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';

import type { RosterRow } from '../../../lib/roster';

import { ActivityCell, RoleCell } from '../../../ui/components/ClanRoster/components';

const column = createColumnHelper<RosterRow>();

export const useRosterColumns = (): ColumnDef<RosterRow, never>[] => {
  const t = useTranslations('clans.roster');
  const format = useFormatter();

  return [
    column.accessor('nickname', {
      header: t('columns.nickname'),
      cell: (info) => <PlayerNameCell nickname={info.getValue()} withAvatar={false} />,
      meta: { width: '20%' }
    }),
    column.accessor((row) => clanRoleSchema.options.indexOf(row.role), {
      id: 'role',
      header: t('columns.role'),
      cell: (info) => <RoleCell role={info.row.original.role} />,
      meta: { hideBelow: 'sm' }
    }),
    column.accessor((row) => row.daysInClan ?? -1, {
      id: 'daysInClan',
      header: t('columns.daysInClan'),
      cell: (info) => (info.getValue() < 0 ? '—' : format.number(info.getValue())),
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    }),
    column.accessor((row) => row.inactiveDays ?? Number.MAX_SAFE_INTEGER, {
      id: 'lastBattle',
      header: t('columns.lastBattle'),
      cell: (info) => <ActivityCell inactiveDays={info.row.original.inactiveDays} status={info.row.original.status} />,
      meta: { hideBelow: 'md' }
    }),
    column.accessor((row) => row.battles ?? 0, {
      id: 'battles',
      header: t('columns.battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor((row) => row.winRate ?? 0, {
      id: 'winRate',
      header: t('columns.winRate'),
      cell: (info) => <WinRateCell value={info.row.original.winRate} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8.value ?? 0, {
      id: 'wn8',
      header: 'WN8',
      cell: (info) => <RatingValue rating={info.row.original.wn8} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.recentWn8.value ?? 0, {
      id: 'recentWn8',
      header: t('columns.recentWn8'),
      cell: (info) => <RatingValue rating={info.row.original.recentWn8} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'lg' }
    })
  ];
};
