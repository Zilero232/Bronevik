'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { HISTORY } from '../../../config';
import { useHistoryTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { HistoryTimeline } from './components';

import s from './HistoryTab.module.scss';

export const HistoryTab = () => {
  const t = useTranslations('profile.history');
  const { nicknames, clans, isEmpty, isPending, isError, isRetrying, retry } = useHistoryTab();

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={retry} />;
  }

  if (isPending) {
    return <Skeleton height={HISTORY.skeletonHeight} shape='block' />;
  }

  if (isEmpty) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <div className={s.root}>
      <ProfilePanel isFlush title={t('nicknames')}>
        <HistoryTimeline entries={nicknames} />
      </ProfilePanel>
      <ProfilePanel isFlush title={t('clans')}>
        <HistoryTimeline entries={clans} />
      </ProfilePanel>
    </div>
  );
};
