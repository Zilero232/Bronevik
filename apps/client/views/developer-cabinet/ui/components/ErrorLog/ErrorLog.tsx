'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, ErrorState } from '@/ui-kit';

import type { ErrorLogProps } from './ErrorLog.types';

import { useApiKeyErrors, useErrorLogColumns } from '../../../model/hooks';

import s from './ErrorLog.module.scss';

export const ErrorLog = ({ keyId }: ErrorLogProps) => {
  const t = useTranslations('developer.usage.errorLog');
  const { data: entries, isPending, isError, isFetching, refetch } = useApiKeyErrors(keyId);
  const columns = useErrorLogColumns();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      <DataTable
        caption={t('title')}
        columns={columns}
        data={entries ?? []}
        emptyState={isError ? <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} /> : <p className={s.empty}>{t('empty')}</p>}
        getRowId={({ id }) => id}
        initialSorting={[{ id: 'occurredAt', desc: true }]}
        isLoading={isPending}
      />
    </Card>
  );
};
