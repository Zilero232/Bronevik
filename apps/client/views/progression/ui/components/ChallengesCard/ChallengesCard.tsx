'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { PlusGate } from '@/features/plus/plus-gate';
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { PROGRESS_PAGE } from '../../../config';
import { useTankChallenges } from '../../../model/hooks';
import { ChallengeSet } from './components';

import s from './ChallengesCard.module.scss';

export const ChallengesCard = () => {
  const t = useTranslations('progression.challenges');
  const format = useFormatter();
  const { sets, endsAt, isPending, isError, isRetrying, retry } = useTankChallenges();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader
        meta={endsAt ? t('endsAt', { date: format.dateTime(new Date(endsAt), { weekday: 'long', day: 'numeric', month: 'long' }) }) : null}
        title={t('title')}
      />
      <p className={s.description}>{t('description')}</p>
      <PlusGate feature='progression'>
        {isPending && <Skeleton height={PROGRESS_PAGE.skeletonHeight} shape='block' />}
        {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
        {!isPending && !isError && sets.length === 0 && <EmptyState isCompact title={t('empty')} />}
        {sets.length > 0 && (
          <div className={s.sets}>
            {sets.map((set) => (
              <ChallengeSet key={set.key} items={set.items} tankId={set.tankId} vehicle={set.vehicle} />
            ))}
          </div>
        )}
      </PlusGate>
    </Card>
  );
};
