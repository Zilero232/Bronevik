'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { PlayerNameCell } from '@/entities/player/player';
import { percentText } from '@/shared/lib';

import type { CollectorRow } from '../../achievements.types';

const column = createColumnHelper<CollectorRow>();

export const useCollectorColumns = (): TableColumn<CollectorRow>[] => {
  const t = useTranslations('achievements.collectors.columns');
  const format = useFormatter();

  return [
    column.accessor('rank', { header: '#', meta: { width: 48, align: 'end', isRank: true } }),
    column.accessor('nickname', {
      header: t('player'),
      cell: ({ row: { original } }) => <PlayerNameCell clanTag={original.clanTag} nickname={original.nickname} />
    }),
    column.accessor('held', {
      header: t('held'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('points', {
      header: t('points'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor('completion', {
      header: t('completion'),
      cell: (info) => percentText({ format, value: info.getValue() }),
      meta: { align: 'end', isNumeric: true, bar: { tone: 'accent', max: 100 } }
    })
  ];
};
