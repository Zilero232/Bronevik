'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, CardHeader, DataTable, ErrorState } from '@/ui-kit';

import { useMyBattles } from '../../../model/hooks';
import { ModEmptyState } from '../ModEmptyState';
import { NoAccountState } from '../NoAccountState';
import { BattleCard } from './components';

import s from './BattlesTab.module.scss';

export const BattlesTab = () => {
  const t = useTranslations('analytics.battles');
  const {
    items,
    total,
    columns,
    isPending,
    isError,
    isNoAccount,
    isRetrying,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    retry,
    battleLink,
    battleTint
  } = useMyBattles();

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
        getRowLink={battleLink}
        isLoading={isPending}
        renderCard={(row) => <BattleCard battle={row} href={battleLink(row).href} />}
        rowTint={battleTint}
      />
    </Card>
  );
};
