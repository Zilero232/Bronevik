'use client';

import { CircleOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { DataSourceNote, EmptyState, ErrorState, Legend, PageHeader } from '@/ui-kit';

import { GUESS_LEGEND } from '../config';
import { GuessGameContext } from '../model/context';
import { useGuessGameState } from '../model/hooks';
import { GuessArena, GuessSkeleton } from './components';

import s from './GuessTankPage.module.scss';

export const GuessTankPage = () => {
  const t = useTranslations('play');
  const state = useGuessGameState();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')}>
        <Legend
          aria-label={t('head.legendLabel')}
          items={GUESS_LEGEND.map(({ verdict, tone }) => ({ key: verdict, tone, label: t(`head.legend.${verdict}`) }))}
        />
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
