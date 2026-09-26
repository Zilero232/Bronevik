'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, DataSourceNote, PageHeader } from '@/ui-kit';

import { PlayerSearch, PopularPlayers, RecentPlayers } from './components';

import s from './PlayersPage.module.scss';

export const PlayersPage = () => {
  const t = useTranslations('players.head');

  return (
    <div className={s.root}>
      <PageHeader
        actions={
          <>
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.comparePlayers}>
              {t('compare')}
            </Link>
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.top}>
              {t('top')}
            </Link>
          </>
        }
        description={t('description')}
        title={t('title')}
      >
        <PlayerSearch />
      </PageHeader>
      <RecentPlayers />
      <PopularPlayers />
      <DataSourceNote />
    </div>
  );
};
