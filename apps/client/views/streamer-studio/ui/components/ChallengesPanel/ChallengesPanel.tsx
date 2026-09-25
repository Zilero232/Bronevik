'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { ChallengeForm } from '../ChallengeForm';
import { ChallengeList } from '../ChallengeList';

import s from './ChallengesPanel.module.scss';

export const ChallengesPanel = () => {
  const t = useTranslations('streamer.challenges');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} title={t('title')} />
      <div className={s.layout}>
        <ChallengeForm />
        <ChallengeList />
      </div>
    </section>
  );
};
