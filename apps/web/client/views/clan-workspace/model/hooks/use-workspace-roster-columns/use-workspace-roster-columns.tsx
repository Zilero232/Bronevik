'use client';

import { clanRoleSchema } from '@otmetki/schemas';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { PlayerNameCell } from '@/entities/player/player';
import { RatingValue } from '@/entities/player/stats';

import type { WorkspaceRosterRow } from '../use-workspace-roster';

import { AttendanceCell, RoleCell } from '../../../ui/components/WorkspaceRoster/components';

const column = createColumnHelper<WorkspaceRosterRow>();

export const useWorkspaceRosterColumns = (): TableColumn<WorkspaceRosterRow>[] => {
  const t = useTranslations('clanWorkspace.roster');

  return [
    column.accessor('nickname', {
      header: t('columns.nickname'),
      cell: (info) => <PlayerNameCell nickname={info.getValue()} withAvatar={false} />,
      meta: { width: '24%' }
    }),
    column.accessor((row) => clanRoleSchema.options.indexOf(row.role), {
      id: 'role',
      header: t('columns.role'),
      cell: (info) => <RoleCell isOfficer={info.row.original.isOfficer} role={info.row.original.role} />
    }),
    column.accessor((row) => row.rate ?? -1, {
      id: 'attendance',
      header: t('columns.attendance'),
      cell: (info) => <AttendanceCell row={info.row.original} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.inactiveDays ?? Number.MAX_SAFE_INTEGER, {
      id: 'inactive',
      header: t('columns.inactive'),
      cell: (info) => (info.row.original.inactiveDays === null ? '—' : t('daysAgo', { days: info.row.original.inactiveDays })),
      meta: { align: 'end', hideBelow: 'md' }
    }),
    column.accessor((row) => row.recentWn8.value ?? 0, {
      id: 'recentWn8',
      header: t('columns.recentWn8'),
      cell: (info) => <RatingValue rating={info.row.original.recentWn8} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    })
  ];
};
