'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, CardHeader, DataTable, QueryState } from '@/ui-kit';

import { useMyBattles } from '../../../model/hooks';
import { ModEmptyState } from '../ModEmptyState';
import { NoAccountState } from '../NoAccountState';
import { BattleCard } from './components';

import s from './BattlesTab.module.scss';

export const BattlesTab = () => {
  const t = useTranslations('analytics.battles');
  const { total, hasNextPage, isFetchingNextPage, loadMore, query, columns, isNoAccount, battleLink, battleTint } = useMyBattles();

  return (
    <Card padding='none'>
      <CardHeader meta={t('count', { count: total })} title={t('title')} />
      {isNoAccount ? (
        <NoAccountState />
      ) : (
        <QueryState
          empty={<ModEmptyState title={t('empty')} />}
          query={query}
          skeleton={<DataTable isLoading caption={t('title')} columns={columns} data={[]} density='media' />}
        >
          {(items) => (
            <DataTable
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
              renderCard={(row) => <BattleCard battle={row} href={battleLink(row).href} />}
              rowTint={battleTint}
            />
          )}
        </QueryState>
      )}
    </Card>
  );
};
