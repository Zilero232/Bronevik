'use client';

import { useTranslations } from 'next-intl';

import { ErrorState, Skeleton } from '@/ui-kit';

import { EVENTS } from '../../../config';
import { useActiveDrops } from '../../../model/hooks';
import { EventGroup } from '../EventGroup';

export const DropsPanel = () => {
  const t = useTranslations('events.drops');
  const drops = useActiveDrops();

  if (drops.isPending) {
    return <Skeleton height={EVENTS.dropsSkeleton} shape='block' />;
  }

  if (drops.isError) {
    return <ErrorState isCompact description={t('errorDescription')} isRetrying={drops.isRetrying} title={t('errorTitle')} onRetry={drops.retry} />;
  }

  return <EventGroup emptyTitle={t('empty')} entries={drops.entries} title={t('title')} />;
};
