'use client';

import { CircleOff, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState } from '@/ui-kit';

import { GuessGameContext, useGuessGameState } from '../model/context';
import { GuessArena, GuessHero, GuessSkeleton } from './components';

import s from './GuessTankPage.module.scss';

export const GuessTankPage = () => {
  const t = useTranslations('play.states');
  const state = useGuessGameState();

  return (
    <div className={s.root}>
      <GuessHero />
      <div className={s.body}>
        {match(state)
          .with({ kind: 'loading' }, () => <GuessSkeleton />)
          .with({ kind: 'error' }, () => (
            <EmptyState description={t('errorDescription')} icon={<TriangleAlert size={28} />} title={t('errorTitle')} />
          ))
          .with({ kind: 'unavailable' }, () => (
            <EmptyState description={t('emptyDescription')} icon={<CircleOff size={28} />} title={t('emptyTitle')} />
          ))
          .with({ kind: 'ready' }, ({ game }) => (
            <GuessGameContext value={game}>
              <GuessArena />
            </GuessGameContext>
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
