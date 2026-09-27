'use client';

import { useTranslations } from 'next-intl';

import { DataTable, EmptyState, ErrorState } from '@/ui-kit';

import { entrantLink } from '../../../lib/entrant-link';
import { useTopTable } from '../../../model/hooks';

import s from './TopTable.module.scss';

export const TopTable = () => {
  const t = useTranslations('top');
  const { columns, entries, tank, summary, isPending, isError, isRetrying, isRefreshing, retry } = useTopTable();

  if (isError) {
    return <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />;
  }

  return (
    <div className={s.root} data-refreshing={isRefreshing}>
      <DataTable
        columns={columns}
        data={entries}
        density={tank ? 'media' : 'default'}
        emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        getRowId={(row) => `${row.rank}-${row.name}`}
        getRowLink={entrantLink}
        isLoading={isPending}
        summary={summary}
      />
    </div>
  );
};
