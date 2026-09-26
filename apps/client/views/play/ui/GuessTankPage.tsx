'use client';

import { CircleOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { DataSourceNote, EmptyState, ErrorState, PageHeader } from '@/ui-kit';

import { GuessGameContext } from '../model/context';
import { useGuessGameState } from '../model/hooks';
import { GuessArena, GuessLegend, GuessSkeleton } from './components';

import s from './GuessTankPage.module.scss';

export const GuessTankPage = () => {
  const t = useTranslations('play');
  const state = useGuessGameState();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')}>
        <GuessLegend />
      </PageHeader>
      {match(state)
        .with({ kind: 'loading' }, () => <GuessSkeleton />)
        .with({ kind: 'error' }, ({ isRetrying, retry }) => (
          <ErrorState description={t('states.errorDescription')} isRetrying={isRetrying} title={t('states.errorTitle')} onRetry={retry} />
        ))
        .with({ kind: 'unavailable' }, () => (
          <EmptyState description={t('states.emptyDescription')} icon={<CircleOff size={16} />} title={t('states.emptyTitle')} />
        ))
        .with({ kind: 'ready' }, ({ game }) => (
          <GuessGameContext value={game}>
            <GuessArena />
          </GuessGameContext>
        ))
        .exhaustive()}
      <DataSourceNote />
    </div>
  );
};
