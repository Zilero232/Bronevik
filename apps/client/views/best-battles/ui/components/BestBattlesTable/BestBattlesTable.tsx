'use client';

import { useTranslations } from 'next-intl';

import { Button, DataTable } from '@/ui-kit';

import type { BestBattlesTableProps } from './BestBattlesTable.types';

import { useBestBattlesColumns } from '../../../model/hooks';
import { BestBattleCard } from './components';

import s from './BestBattlesTable.module.scss';

export const BestBattlesTable = ({ battles, metric, emptyState, isLoading, hasNextPage, isFetchingNextPage, onLoadMore }: BestBattlesTableProps) => {
  const t = useTranslations('bestBattles');
  const columns = useBestBattlesColumns({ metric });

  return (
    <DataTable
      footer={
        hasNextPage && (
          <div className={s.more}>
            <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={onLoadMore}>
              {isFetchingNextPage ? t('table.loading') : t('table.more')}
            </Button>
          </div>
        )
      }
      caption={t('table.caption')}
      columns={columns}
      data={battles}
      density='media'
      emptyState={emptyState}
      getRowId={(row) => row.key}
      isLoading={isLoading}
      renderCard={(row) => <BestBattleCard battle={row} metric={metric} />}
    />
  );
};
