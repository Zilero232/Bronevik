'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { useRecentSearches } from '../../../../../model/hooks';

import s from './RecentSearches.module.scss';

export const RecentSearches = () => {
  const t = useTranslations('home.hero');
  const players = useRecentSearches();

  if (players.length === 0) {
    return null;
  }

  return (
    <p className={s.root}>
      <span className={s.label}>{t('recent')}</span>
      {players.map((player) => (
        <Link key={player.accountId} className={s.link} href={ROUTES.players.profile(player.nickname)}>
          {player.nickname}
        </Link>
      ))}
    </p>
  );
};
