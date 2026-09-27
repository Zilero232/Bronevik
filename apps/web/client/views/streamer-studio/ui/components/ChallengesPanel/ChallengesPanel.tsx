'use client';

import { useTranslations } from 'next-intl';

import { ChallengeForm } from '../ChallengeForm';
import { ChallengeList } from '../ChallengeList';

import s from './ChallengesPanel.module.scss';

export const ChallengesPanel = () => {
  const t = useTranslations('streamer.challenges');

  return (
    <section className={s.root}>
      <p className={s.note}>{t('description')}</p>
      <div className={s.layout}>
        <ChallengeForm />
        <ChallengeList />
      </div>
    </section>
  );
};
