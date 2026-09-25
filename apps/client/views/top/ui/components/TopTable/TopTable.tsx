'use client';

import type { LeaderboardEntry } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { DataTable } from '@/ui-kit';

import type { TopTableProps } from './TopTable.types';

import { EntryValue } from '../EntryValue';

import s from './TopTable.module.scss';

const column = createColumnHelper<LeaderboardEntry>();

export const TopTable = ({ entries, filter }: TopTableProps) => {
  const t = useTranslations('top');
  const format = useFormatter();

  const columns: ColumnDef<LeaderboardEntry, never>[] = [
    column.accessor('rank', { header: '#', cell: (info) => <span className={s.rank}>{info.getValue()}</span>, meta: { width: 44 } }),
    column.accessor('name', {
      header: filter.scope === 'clans' ? t('columns.clan') : t('columns.player'),
      cell: ({ row: { original } }) =>
        original.accountId === null ? (
          <Link className={s.link} href={ROUTES.clan(original.clanTag ?? original.name)}>
            {original.color && <span aria-hidden className={s.swatch} style={{ '--clan-color': original.color }} />}
            <span className={s.tag}>[{original.clanTag}]</span> {original.name}
          </Link>
        ) : (
          <Link className={s.link} href={ROUTES.player(original.name)}>
            <PlayerIdentity player={{ nickname: original.name, clanTag: original.clanTag }} />
          </Link>
        )
    }),
    column.accessor('value', {
      header: t('columns.value'),
      cell: ({ row: { original } }) => <EntryValue entry={original} filter={filter} />,
      meta: { align: 'end' }
    }),
    column.accessor('battles', {
      header: t('columns.battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    })
  ];

  return <DataTable caption={t('tableCaption')} columns={columns} data={entries} getRowId={(row) => `${row.rank}-${row.name}`} />;
};
