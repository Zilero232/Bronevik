'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { Guide } from '@/entities/guide/guide';
import type { TableColumn } from '@/ui-kit';

import { GuideSubject } from '@/features/community/guide-meta';
import { RelativeTime } from '@/ui-kit';

import { GuideAuthorCell, GuideTitleCell } from '../../../ui/components/GuideTable/components';

const column = createColumnHelper<Guide>();

export const useGuideColumns = (): TableColumn<Guide>[] => {
  const t = useTranslations('guides');
  const format = useFormatter();

  return [
    column.accessor('title', {
      header: t('list.columns.title'),
      enableSorting: false,
      cell: ({ row: { original } }) => <GuideTitleCell guide={original} />
    }),
    column.accessor('kind', {
      header: t('list.columns.kind'),
      enableSorting: false,
      cell: ({ row: { original } }) => t(`kinds.${original.kind}`),
      meta: { hideBelow: 'md' }
    }),
    column.display({
      id: 'subject',
      header: t('list.columns.subject'),
      cell: ({ row: { original } }) => <GuideSubject arenaId={original.arenaId} tankId={original.tankId} />,
      meta: { hideBelow: 'lg' }
    }),
    column.accessor('author', {
      header: t('list.columns.author'),
      enableSorting: false,
      cell: (info) => <GuideAuthorCell author={info.getValue()} />,
      meta: { hideBelow: 'sm' }
    }),
    column.accessor('likesCount', {
      header: t('list.columns.likes'),
      enableSorting: false,
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('publishedAt', {
      header: t('list.columns.date'),
      enableSorting: false,
      cell: ({ row: { original } }) => <RelativeTime value={original.publishedAt ?? original.createdAt} />,
      meta: { align: 'end', hideBelow: 'md' }
    })
  ];
};
