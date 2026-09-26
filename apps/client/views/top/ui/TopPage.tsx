'use client';

import type { LeaderboardScope } from '@otmetki/schemas';

import { MasteryIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { ActionStrip, Card, DataSourceNote, ErrorState, PageHero, Tabs } from '@/ui-kit';

import { TOP_SCOPES } from '../config';
import { useTop } from '../model/hooks';
import { TopFilters, TopPodium, TopTable } from './components';

import s from './TopPage.module.scss';

export const TopPage = () => {
  const t = useTranslations('top');
  const { state, filter, board, podium, isPending, isError, isRefreshing, isRetrying, retry, update } = useTop();

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <MasteryIcon level='master' size={480} /> }}
        breadcrumbs={[{ label: t('hero.home'), href: ROUTES.home }, { label: t('title') }]}
        lead={t('description')}
        title={t('title')}
      />
      <ActionStrip
        start={
          <Tabs<LeaderboardScope>
            items={TOP_SCOPES.map((value) => ({ value, label: t(`scopes.${value}`) }))}
            value={state.scope}
            onValueChange={(scope) => update({ scope })}
          />
        }
        align='bottom'
      />
      <div className={s.content}>
        {!isError && podium.length > 0 && (
          <div className={s.board} data-refreshing={isRefreshing}>
            <TopPodium entries={podium} filter={filter} />
          </div>
        )}
        <Card padding='none'>
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
    </div>
  );
};
