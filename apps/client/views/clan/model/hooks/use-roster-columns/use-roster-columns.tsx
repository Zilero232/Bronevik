'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { clanRoleSchema } from '@bronevik/schemas';
import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { RosterRow } from '../../../lib/roster';

import { ActivityCell, RatingCell, WinRateCell } from './use-roster-columns.cells';

import s from './use-roster-columns.module.scss';

const column = createColumnHelper<RosterRow>();

const DASH = '—';

export const useRosterColumns = (): ColumnDef<RosterRow, never>[] => {
  const t = useTranslations('clans.roster');
  const format = useFormatter();

  return [
    column.accessor('nickname', {
      header: t('columns.nickname'),
      cell: (info) => (
        <Link className={s.nickname} href={ROUTES.player(info.getValue())}>
          {info.getValue()}
        </Link>
      ),
      meta: { width: '20%' }
    }),
    column.accessor((row) => clanRoleSchema.options.indexOf(row.role), {
      id: 'role',
      header: t('columns.role'),
      cell: (info) => (
        <span className={s.role} data-role={info.row.original.role}>
          {t(`roles.${info.row.original.role}`)}
        </span>
      )
    }),
    column.accessor((row) => row.daysInClan ?? -1, {
      id: 'daysInClan',
      header: t('columns.daysInClan'),
      cell: (info) => (info.getValue() < 0 ? DASH : format.number(info.getValue())),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.inactiveDays ?? Number.MAX_SAFE_INTEGER, {
      id: 'lastBattle',
      header: t('columns.lastBattle'),
      cell: (info) => <ActivityCell inactiveDays={info.row.original.inactiveDays} status={info.row.original.status} />
    }),
    column.accessor((row) => row.battles ?? 0, {
      id: 'battles',
      header: t('columns.battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.winRate ?? 0, {
      id: 'winRate',
      header: t('columns.winRate'),
      cell: (info) => <WinRateCell winRate={info.row.original.winRate} />,
      meta: { align: 'end' }
    }),
    column.accessor((row) => row.wn8.value ?? 0, {
      id: 'wn8',
      header: 'WN8',
      cell: (info) => <RatingCell {...info.row.original.wn8} />,
      meta: { align: 'end' }
    }),
    column.accessor((row) => row.recentWn8.value ?? 0, {
      id: 'recentWn8',
      header: t('columns.recentWn8'),
      cell: (info) => <RatingCell {...info.row.original.recentWn8} />,
      meta: { align: 'end' }
    })
  ];
};
