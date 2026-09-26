'use client';

import type { WatchlistPlayer } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerNameCell } from '@/entities/player/player';
import { RatingValue, scaledRating } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';
import { RelativeTime } from '@/ui-kit';

import type { UseWatchlistColumnsInput } from './use-watchlist-columns.types';

import { MarksCell, RemoveCell } from '../../../ui/components/WatchlistTable/components';

const column = createColumnHelper<WatchlistPlayer>();

export const useWatchlistColumns = ({ isRemoving, onRemove }: UseWatchlistColumnsInput): ColumnDef<WatchlistPlayer, never>[] => {
  const t = useTranslations('watchlist.table');
  const format = useFormatter();

  return [
    column.accessor((row) => row.nickname ?? String(row.accountId), {
      id: 'nickname',
      header: t('columns.player'),
      cell: (info) => <PlayerNameCell clanTag={info.row.original.clanTag} nickname={info.getValue()} withAvatar={false} />,
      meta: { width: '26%' }
    }),
    column.accessor((row) => (row.lastBattleAt ? new Date(row.lastBattleAt).getTime() : 0), {
      id: 'lastBattle',
      header: t('columns.lastBattle'),
      cell: (info) => <RelativeTime fallback={t('never')} value={info.row.original.lastBattleAt} />
    }),
    column.accessor('battles', {
      header: t('columns.battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.winRate ?? -1, {
      id: 'winRate',
      header: t('columns.winRate'),
      cell: (info) => <WinRateCell value={info.row.original.winRate} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.avgDamage ?? -1, {
      id: 'avgDamage',
      header: t('columns.avgDamage'),
      cell: (info) => (info.row.original.avgDamage === null ? '—' : format.number(info.row.original.avgDamage, { maximumFractionDigits: 0 })),
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.wn8 ?? -1, {
      id: 'wn8',
      header: t('columns.wn8'),
      cell: (info) => <RatingValue rating={scaledRating({ scale: 'wn8', value: info.row.original.wn8 })} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor('marksGained', {
      header: t('columns.marks'),
      cell: (info) => <MarksCell value={info.getValue()} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.display({
      id: 'remove',
      header: '',
      cell: (info) => <RemoveCell isDisabled={isRemoving} player={info.row.original} onRemove={onRemove} />,
      meta: { width: 48, align: 'end' }
    })
  ];
};
