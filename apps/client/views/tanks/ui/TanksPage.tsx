'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { useTanksState } from '../model/hooks';
import { StatsControls, StatsTable, TanksFigures, TierList } from './components';

import s from './TanksPage.module.scss';

export const TanksPage = () => {
  const t = useTranslations('tanks');
  const [{ view }] = useTanksState();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')}>
        <TanksFigures />
      </PageHeader>
      <StatsControls />
      {view === 'table' ? <StatsTable /> : <TierList />}
      <p className={s.source}>{t('source')}</p>
    </div>
  );
};
