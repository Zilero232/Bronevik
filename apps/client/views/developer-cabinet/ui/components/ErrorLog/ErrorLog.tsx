'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, QueryState } from '@/ui-kit';

import type { ErrorLogProps } from './ErrorLog.types';

import { useApiKeyErrors, useErrorLogColumns } from '../../../model/hooks';

import s from './ErrorLog.module.scss';

export const ErrorLog = ({ keyId }: ErrorLogProps) => {
  const t = useTranslations('developer.usage.errorLog');
  const query = useApiKeyErrors(keyId);
  const columns = useErrorLogColumns();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      <QueryState
        empty={<p className={s.empty}>{t('empty')}</p>}
        query={query}
        skeleton={<DataTable isLoading caption={t('title')} columns={columns} data={[]} />}
      >
        {(entries) => (
          <DataTable
            caption={t('title')}
            columns={columns}
            data={entries}
            getRowId={({ id }) => id}
            initialSorting={[{ id: 'occurredAt', desc: true }]}
          />
        )}
      </QueryState>
    </Card>
  );
};
