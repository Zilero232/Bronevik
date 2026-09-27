'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState } from '@/ui-kit';

import type { SessionsTableProps } from './SessionsTable.types';

import { useSessionsColumns } from '../../../model/hooks';

export const SessionsTable = ({ sessions }: SessionsTableProps) => {
  const t = useTranslations('analytics.overview.sessions');
  const columns = useSessionsColumns();

  return (
    <Card padding='none'>
      <CardHeader meta={t('description')} title={t('title')} />
      <DataTable
        caption={t('title')}
        columns={columns}
        data={sessions}
        density='compact'
        emptyState={<EmptyState isCompact title={t('empty')} />}
        getRowId={(row) => row.id}
        initialSorting={[{ id: 'startedAt', desc: true }]}
      />
    </Card>
  );
};
