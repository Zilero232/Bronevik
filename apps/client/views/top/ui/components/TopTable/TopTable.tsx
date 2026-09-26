'use client';

import { useTranslations } from 'next-intl';

import { DataTable, EmptyState } from '@/ui-kit';

import type { TopTableProps } from './TopTable.types';

import { useTopColumns } from '../../../model/hooks';

export const TopTable = ({ entries, filter, tank, isLoading, summary }: TopTableProps) => {
  const t = useTranslations('top');
  const columns = useTopColumns({ filter, tank, entries });

  return (
    <DataTable
      columns={columns}
      data={entries}
      density={tank ? 'media' : 'default'}
      emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
      getRowId={(row) => `${row.rank}-${row.name}`}
      isLoading={isLoading}
      summary={summary}
    />
  );
};
