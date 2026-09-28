'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { LeagueEntry } from '@/entities/social/league';
import type { TableColumn } from '@/ui-kit';

import { PlayerNameCell } from '@/entities/player/player';
import { NumberCell } from '@/ui-kit';

import type { UseLeagueColumnsInput } from './use-league-columns.types';

import { RankCell, ValueCell } from '../../../ui/components/LeagueTable/components';
import { TierBadge } from '../../../ui/components/TierBadge';

const column = createColumnHelper<LeagueEntry>();

export const useLeagueColumns = ({ metric, scope }: UseLeagueColumnsInput): TableColumn<LeagueEntry>[] => {
  const t = useTranslations('social.leagues');

  return [
    column.accessor('rank', {
      header: t('columns.rank'),
      cell: (info) => <RankCell row={info.row.original} />,
      meta: { width: '96px' }
    }),
    column.accessor((row) => row.nickname ?? '', {
      id: 'player',
      header: t('columns.player'),
      cell: (info) =>
        info.row.original.nickname ? (
          <PlayerNameCell nickname={info.row.original.nickname} withAvatar={false} />
        ) : (
          t('unknownPlayer', { id: info.row.original.accountId })
        )
    }),
    ...(scope === 'friends'
      ? [
          column.accessor((row) => row.tier ?? '', {
            id: 'tier',
            header: t('columns.tier'),
            cell: (info) => (info.row.original.tier ? <TierBadge tier={info.row.original.tier} /> : '—'),
            meta: { hideBelow: 'sm' }
          })
        ]
      : []),
    column.accessor('battles', {
      header: t('columns.battles'),
      cell: (info) => <NumberCell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor((row) => row.value ?? Number.NEGATIVE_INFINITY, {
      id: 'value',
      header: t(`metrics.${metric}`),
      cell: (info) => <ValueCell metric={metric} value={info.row.original.value} />,
      meta: { align: 'end', isNumeric: true }
    })
  ];
};
