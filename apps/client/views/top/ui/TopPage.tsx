'use client';

import type { LeaderboardScope } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataSourceNote, ErrorState, PageHeader, Tabs } from '@/ui-kit';

import { TOP_SCOPES } from '../config';
import { useTop } from '../model/hooks';
import { TopFilters, TopTable } from './components';

import s from './TopPage.module.scss';

export const TopPage = () => {
  const t = useTranslations('top');
  const { state, filter, board, isPending, isError, isRefreshing, isRetrying, retry, update } = useTop();

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')} />
      <Card padding='none'>
        <CardHeader
          tabs={
            <Tabs<LeaderboardScope>
              items={TOP_SCOPES.map((value) => ({ value, label: t(`scopes.${value}`) }))}
              value={state.scope}
              onValueChange={(scope) => update({ scope })}
            />
          }
        />
        <div className={s.body}>
          <TopFilters state={state} onChange={update} />
          {isError ? (
            <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
          ) : (
            <div className={s.board} data-refreshing={isRefreshing}>
              <TopTable
                entries={board?.entries ?? []}
                filter={filter}
                isLoading={isPending}
                summary={board && board.minBattles !== null ? t('minBattles', { count: board.minBattles }) : undefined}
                tank={state.tank}
              />
            </div>
          )}
        </div>
      </Card>
      <DataSourceNote />
    </div>
  );
};
