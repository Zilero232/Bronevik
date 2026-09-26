'use client';

import type { LeaderboardEntry } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { useProfilesCosmetics } from '@/entities/player/cosmetics';
import { TankCell } from '@/entities/tank/tank';

import type { UseTopColumnsInput } from './use-top-columns.types';

import { EntrantCell, RankCell, ValueCell } from '../../../ui/components/TopTable/components';

const column = createColumnHelper<LeaderboardEntry>();

export const useTopColumns = ({ filter, tank, entries }: UseTopColumnsInput): ColumnDef<LeaderboardEntry, never>[] => {
  const t = useTranslations('top');
  const format = useFormatter();
  const cosmetics = useProfilesCosmetics(entries.flatMap((entry) => (entry.accountId === null ? [] : [entry.accountId])));

  const rank = column.accessor('rank', {
    header: '#',
    cell: (info) => <RankCell rank={info.getValue()} />,
    meta: { width: 48, align: 'end' }
  });

  const entrant = column.accessor('name', {
    header: filter.scope === 'clans' ? t('columns.clan') : t('columns.player'),
    cell: ({ row: { original } }) => (
      <EntrantCell badge={original.accountId === null ? null : (cosmetics[original.accountId]?.badge ?? null)} entry={original} />
    )
  });

  const vehicle = tank
    ? [
        column.display({
          id: 'tank',
          header: t('columns.tank'),
          cell: () => <TankCell vehicle={tank} />,
          meta: { isMedia: true }
        })
      ]
    : [];

  const battles = column.accessor('battles', {
    header: t('columns.battles'),
    cell: (info) => format.number(info.getValue()),
    meta: { align: 'end', isNumeric: true }
  });

  const value = column.accessor('value', {
    header: filter.scope === 'marks' ? t('marksLabel') : t(`metrics.${filter.metric}`),
    cell: ({ row: { original } }) => <ValueCell entry={original} filter={filter} />,
    meta: { align: 'end', isNumeric: true }
  });

  return [rank, entrant, ...vehicle, battles, value];
};
