'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/ui-kit';

import { CreateTournamentDialog, TournamentList } from './components';

import s from './TournamentsPage.module.scss';

export const TournamentsPage = () => {
  const t = useTranslations('tournaments.head');

  return (
    <div className={s.root}>
      <PageHeader actions={<CreateTournamentDialog />} description={t('description')} title={t('title')} />
      <TournamentList />
    </div>
  );
};
