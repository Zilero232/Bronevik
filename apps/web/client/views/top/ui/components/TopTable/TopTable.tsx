'use client';

import { useTranslations } from 'next-intl';

import { DataTable, EmptyState, QueryState } from '@/ui-kit';

import { entrantLink } from '../../../lib/entrant-link';
import { useTopTable } from '../../../model/hooks';

import s from './TopTable.module.scss';

export const TopTable = () => {
  const t = useTranslations('top');
  const { columns, entries, tank, summary, query, isRefreshing } = useTopTable();

  return (
    <QueryState
      isCompact
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
      skeleton={<DataTable isLoading columns={columns} data={[]} density={tank ? 'media' : 'default'} />}
    >
      <div className={s.root} data-refreshing={isRefreshing}>
        <DataTable
          columns={columns}
          data={entries}
          density={tank ? 'media' : 'default'}
          emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
          getRowId={(row) => `${row.rank}-${row.name}`}
          getRowLink={entrantLink}
          summary={summary}
        />
      </div>
    </QueryState>
  );
};
