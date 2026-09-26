'use client';

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ErrorState, Skeleton } from '@/ui-kit';

import type { ReplayPageProps } from './ReplayPage.types';

import { useReplayPage } from '../model/hooks';
import { ReplayHeatmap, ReplayOverview, ReplayScoreboard, ReplayStatusState, ReplayTimeline } from './components';

import s from './ReplayPage.module.scss';

export const ReplayPage = ({ id }: ReplayPageProps) => {
  const t = useTranslations('replays.detail');
  const { data: replay, isPending, isFetching, error, refetch } = useReplayPage(id);

  return (
    <div className={s.root}>
      {match({ replay, isPending, error })
        .with({ replay: { status: 'parsed' } }, ({ replay: loaded }) => (
          <>
            <ReplayOverview replay={loaded} />
            <ReplayScoreboard replay={loaded} />
            <div className={s.grid}>
              <ReplayTimeline replay={loaded} />
              <ReplayHeatmap replay={loaded} />
            </div>
          </>
        ))
        .with({ replay: P.nonNullable }, ({ replay: loaded }) => <ReplayStatusState replay={loaded} />)
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            <Skeleton height={180} shape='block' />
            <Skeleton height={360} shape='block' />
          </div>
        ))
        .with({ error: P.when(isNotFoundError) }, () => notFound())
        .otherwise(() => (
          <ErrorState description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={() => void refetch()} />
        ))}
    </div>
  );
};
