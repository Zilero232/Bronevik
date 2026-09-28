'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, EmptyState, QueryState } from '@/ui-kit';

import { useCollectorColumns, useCollectors } from '../../../model/hooks';

export const CollectorsTab = () => {
  const t = useTranslations('achievements.collectors');
  const columns = useCollectorColumns();
  const query = useCollectors();

  return (
    <QueryState errorTitle={t('error')} query={query} skeleton={<DataTable isLoading columns={columns} data={[]} />}>
      {(board) => (
        <DataTable
          columns={columns}
          data={board.items}
          emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('empty')} />}
          getRowId={(row) => String(row.accountId)}
          getRowLink={(row) => ({ href: ROUTES.players.profile(row.nickname), label: row.nickname, hasCellLink: true })}
          summary={t('summary', { total: board.total })}
        />
      )}
    </QueryState>
  );
};
