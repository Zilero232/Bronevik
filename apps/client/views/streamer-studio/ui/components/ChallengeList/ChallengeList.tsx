'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useChallenges } from '../../../model/hooks';
import { ChallengeCard } from '../ChallengeCard';

import s from './ChallengeList.module.scss';

export const ChallengeList = () => {
  const t = useTranslations('streamer.challenges.list');
  const { data: challenges = [], isPending, isError, isFetching, refetch } = useChallenges();

  return (
    <section aria-label={t('title')} className={s.root}>
      {match({ challenges, isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={320} shape='block' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
        .with({ challenges: [] }, () => <EmptyState title={t('empty')} />)
        .otherwise(({ challenges: items }) => (
          <ul className={s.list}>
            {items.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard challenge={challenge} />
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
};
