'use client';

import { AtSign, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { useNicknameHistory } from '../../../model/hooks';
import { TabCard } from '../TabCard';
import { TabState } from '../TabState';
import { HistoryTimeline } from './components';

import s from './HistoryTab.module.scss';

export const HistoryTab = () => {
  const t = useTranslations('profile.history');
  const { data: history, isPending, isError } = useNicknameHistory();

  if (isError) {
    return <TabState kind='error' />;
  }

  if (isPending) {
    return <Skeleton height={320} shape='block' />;
  }

  if (history.length === 0) {
    return <TabState kind='empty' />;
  }

  return (
    <div className={s.root}>
      <TabCard eyebrow={t('eyebrow')} title={t('nicknames')}>
        <HistoryTimeline entries={history.filter(({ kind }) => kind === 'nickname')} icon={<AtSign size={14} />} />
      </TabCard>
      <TabCard eyebrow={t('eyebrow')} title={t('clans')}>
        <HistoryTimeline entries={history.filter(({ kind }) => kind === 'clan')} icon={<Shield size={14} />} />
      </TabCard>
    </div>
  );
};
