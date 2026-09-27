'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import { EVENTS } from '../../../config';
import { useActiveDrops } from '../../../model/hooks';
import { EventGroup } from '../EventGroup';

export const DropsPanel = () => {
  const t = useTranslations('events.drops');
  const { query, entries } = useActiveDrops();

  return (
    <QueryState
      isCompact
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      query={query}
      skeleton={<Skeleton height={EVENTS.dropsSkeleton} shape='block' />}
    >
      <EventGroup emptyTitle={t('empty')} entries={entries} title={t('title')} />
    </QueryState>
  );
};
