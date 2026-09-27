'use client';

import { Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Card, DataSourceNote, ErrorState, FilteredEmptyState, KeyFigure, PageHero } from '@/ui-kit';

import { useBestBattles } from '../model/hooks';
import { BestBattlesFilters, BestBattlesPodium, BestBattlesTable } from './components';

import s from './BestBattlesPage.module.scss';

export const BestBattlesPage = () => {
  const t = useTranslations('bestBattles');
  const view = useBestBattles();

  return (
    <div className={s.root}>
      <PageHero
        figures={
          view.facets && (
            <>
              <KeyFigure label={t(`hero.battles.${view.facets.period}`)} value={view.facets.battles} variant='compact' />
              {view.facets.topDamage !== null && <KeyFigure label={t('hero.topDamage')} value={view.facets.topDamage} variant='compact' />}
            </>
          )
        }
        art={{ kind: 'emblem', glyph: <Trophy size={480} strokeWidth={1.25} /> }}
        breadcrumbs={[{ label: t('hero.home'), href: ROUTES.home }, { label: t('hero.title') }]}
        lead={t('hero.lead')}
        title={t('hero.title')}
      />
      <div className={s.content}>
        {!view.isError && view.podium.length > 0 && (
          <div className={s.board} data-refreshing={view.isRefreshing}>
            <BestBattlesPodium battles={view.podium} metric={view.metric} />
          </div>
        )}
        <Card padding='none'>
          <div className={s.body}>
            <BestBattlesFilters />
            {view.isError ? (
              <ErrorState isCompact description={t('error.description')} isRetrying={view.isRetrying} title={t('error.title')} onRetry={view.retry} />
            ) : (
              <div className={s.board} data-refreshing={view.isRefreshing}>
                <BestBattlesTable
                  emptyState={
                    <FilteredEmptyState
                      isCompact
                      description={view.isFiltered ? t('empty.filtered') : t('empty.description')}
                      isFiltered={view.isFiltered}
                      title={t('empty.title')}
                      onReset={view.reset}
                    />
                  }
                  battles={view.battles}
                  hasNextPage={view.hasNextPage}
                  isFetchingNextPage={view.isFetchingNextPage}
                  isLoading={view.isPending}
                  metric={view.metric}
                  onLoadMore={view.loadMore}
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
