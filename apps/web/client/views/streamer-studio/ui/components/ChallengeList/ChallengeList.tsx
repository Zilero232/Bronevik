'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useChallenges } from '../../../model/hooks';
import { ChallengeCard } from '../ChallengeCard';

import s from './ChallengeList.module.scss';

export const ChallengeList = () => {
  const t = useTranslations('streamer.challenges.list');
  const query = useChallenges();

  return (
    <section aria-label={t('title')} className={s.root}>
      <QueryState empty={<EmptyState title={t('empty')} />} query={query} skeleton={<Skeleton height={320} shape='block' />}>
        {(challenges) => (
          <ul className={s.list}>
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard challenge={challenge} />
              </li>
            ))}
          </ul>
        )}
      </QueryState>
    </section>
  );
};
