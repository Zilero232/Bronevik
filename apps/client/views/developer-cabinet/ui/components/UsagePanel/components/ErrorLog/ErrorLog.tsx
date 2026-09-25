'use client';

import type { ApiErrorLogEntry } from '@bronevik/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { Badge, Card, CardHeader, DataTable } from '@/ui-kit';

import type { ErrorLogProps } from './ErrorLog.types';

import { useApiKeyErrors } from '../../../../../model/hooks';
import { TimeAgo } from '../../../TimeAgo';

import s from './ErrorLog.module.scss';

const column = createColumnHelper<ApiErrorLogEntry>();

export const ErrorLog = ({ keyId }: ErrorLogProps) => {
  const t = useTranslations('developer.usage.errorLog');
  const { data: entries, isPending } = useApiKeyErrors(keyId);

  const columns: ColumnDef<ApiErrorLogEntry, never>[] = [
    column.accessor('occurredAt', { header: t('time'), cell: (info) => <TimeAgo className={s.time} value={info.getValue()} /> }),
    column.accessor('path', {
      header: t('request'),
      cell: ({ row: { original } }) => (
        <span className={s.request}>
          <span className={s.method}>{original.method}</span>
          <code className={s.path}>{original.path}</code>
        </span>
      ),
      enableSorting: false
    }),
    column.accessor('status', {
      header: t('status'),
      cell: (info) => <Badge tone={info.getValue() >= 500 ? 'danger' : 'warning'}>{info.getValue()}</Badge>
    }),
    column.accessor('code', {
      header: t('code'),
      cell: ({ row: { original } }) => (
        <span className={s.code} title={original.message ?? undefined}>
          {original.code ?? '—'}
          {original.message && <span className={s.message}>{original.message}</span>}
        </span>
      ),
      enableSorting: false
    })
  ];

  return (
    <Card className={s.root} padding='none'>
      <CardHeader className={s.header} eyebrow={t('eyebrow')} title={t('title')} />
      <DataTable
        caption={t('title')}
        columns={columns}
        data={entries ?? []}
        emptyState={<p className={s.empty}>{t('empty')}</p>}
        getRowId={({ id }) => id}
        initialSorting={[{ id: 'occurredAt', desc: true }]}
        isLoading={isPending}
      />
    </Card>
  );
};
