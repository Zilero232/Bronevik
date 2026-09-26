'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, CardHeader, DataTable, ErrorState } from '@/ui-kit';

import { useMyBattles } from '../../../model/hooks';
import { ModEmptyState } from '../ModEmptyState';
import { NoAccountState } from '../NoAccountState';

import s from './BattlesTab.module.scss';

export const BattlesTab = () => {
  const t = useTranslations('analytics.battles');
  const { items, total, columns, isPending, isError, isNoAccount, isRetrying, hasNextPage, isFetchingNextPage, loadMore, retry, openBattle } =
    useMyBattles();

  return (
    <Card padding='none'>
      <CardHeader meta={t('count', { count: total })} title={t('title')} />
      <DataTable
        emptyState={
          isNoAccount ? <NoAccountState /> : isError ? <ErrorState isRetrying={isRetrying} onRetry={retry} /> : <ModEmptyState title={t('empty')} />
        }
        footer={
          hasNextPage && (
            <div className={s.footer}>
              <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
                {t('loadMore')}
              </Button>
            </div>
          )
        }
        caption={t('title')}
        columns={columns}
        data={items}
        density='media'
        getRowId={(row) => row.id}
        isLoading={isPending}
        onRowClick={(row) => openBattle(row.id)}
      />
    </Card>
  );
};
