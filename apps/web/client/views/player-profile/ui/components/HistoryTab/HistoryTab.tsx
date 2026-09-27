'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { HISTORY } from '../../../config';
import { useHistoryTab } from '../../../model/hooks';
import { ProfilePanel } from '../ProfilePanel';
import { HistoryTimeline } from './components';

import s from './HistoryTab.module.scss';

export const HistoryTab = () => {
  const t = useTranslations('profile.history');
  const { query, nicknames, clans } = useHistoryTab();

  return (
    <QueryState empty={<EmptyState title={t('empty')} />} query={query} skeleton={<Skeleton height={HISTORY.skeletonHeight} shape='block' />}>
      <div className={s.root}>
        <ProfilePanel isFlush title={t('nicknames')}>
          <HistoryTimeline entries={nicknames} />
        </ProfilePanel>
        <ProfilePanel isFlush title={t('clans')}>
          <HistoryTimeline entries={clans} />
        </ProfilePanel>
      </div>
    </QueryState>
  );
};
