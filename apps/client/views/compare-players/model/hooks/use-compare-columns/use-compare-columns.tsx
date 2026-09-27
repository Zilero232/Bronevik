'use client';

import type { PlayerSummary } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { PlayerIdentity } from '@/entities/player/player';

import type { CompareRow } from '../../../lib/compare-rows';

import { ValueCell } from '../../../ui/components/CompareTable/components';

const column = createColumnHelper<CompareRow>();

export const useCompareColumns = (players: PlayerSummary[]): TableColumn<CompareRow>[] => {
  const t = useTranslations('compare');
  const tMetrics = useTranslations('compare.metrics');

  return [
    column.accessor('key', {
      header: t('metric'),
      enableSorting: false,
      cell: ({ row }) => tMetrics(row.original.key),
      meta: { isSticky: true }
    }),
    ...players.map(({ accountId, nickname, clan }, index) =>
      column.accessor((row) => row.values[index], {
        id: String(accountId),
        header: () => <PlayerIdentity player={{ nickname, clanTag: clan?.tag ?? null }} />,
        enableSorting: false,
        cell: ({ row: { original } }) => (
          <ValueCell format={original.format} isBest={original.best.includes(index)} value={original.values[index] ?? null} />
        ),
        meta: { align: 'end', isNumeric: true }
      })
    )
  ];
};
