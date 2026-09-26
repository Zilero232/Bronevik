'use client';

import type { ApiErrorLogEntry } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { CodeCell, OccurredAtCell, RequestCell, StatusCell } from '../../../ui/components/ErrorLog/components';

const column = createColumnHelper<ApiErrorLogEntry>();

export const useErrorLogColumns = (): ColumnDef<ApiErrorLogEntry, never>[] => {
  const t = useTranslations('developer.usage.errorLog');

  return [
    column.accessor('occurredAt', { header: t('time'), cell: ({ getValue }) => <OccurredAtCell value={getValue()} /> }),
    column.accessor('path', {
      header: t('request'),
      cell: ({ row: { original } }) => <RequestCell method={original.method} path={original.path} />,
      enableSorting: false
    }),
    column.accessor('status', { header: t('status'), cell: ({ getValue }) => <StatusCell status={getValue()} /> }),
    column.accessor('code', {
      header: t('code'),
      cell: ({ row: { original } }) => <CodeCell code={original.code} message={original.message} />,
      enableSorting: false
    })
  ];
};
