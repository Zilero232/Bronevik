'use client';

import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { SectionHeader } from '@/ui-kit';

import { useProgressPage } from '../model/hooks';
import { ChallengesCard, SeasonTrackCard, ShellsCard, TankLevelsCard } from './components';

import s from './ProgressPage.module.scss';

export const ProgressPage = () => {
  const t = useTranslations('progression');
  const { isFrozen } = useProgressPage();

  return (
    <div className={s.root}>
      <SectionHeader as='h2' description={t('description')} title={t('title')} />
      {isFrozen && (
        <p className={s.frozen}>
          <PlusBadge />
          {t('frozen')}
        </p>
      )}
      <div className={s.grid}>
        <div className={s.main}>
          <SeasonTrackCard />
          <ChallengesCard />
          <TankLevelsCard />
        </div>
        <aside className={s.side}>
          <ShellsCard />
        </aside>
      </div>
    </div>
  );
};
