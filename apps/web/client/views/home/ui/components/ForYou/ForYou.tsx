'use client';

import { BarChart3, Eye, Trophy, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card } from '@/ui-kit';

import { useForYou } from '../../../model/hooks';

import s from './ForYou.module.scss';

export const ForYou = () => {
  const t = useTranslations('home.forYou');
  const { isVisible, nickname, firstWin } = useForYou();

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-label={t('label')} className={s.root}>
      <Card className={s.card}>
        <div className={s.head}>
          <h2 className={s.title}>{nickname ? t('title', { nickname }) : t('titleNoAccount')}</h2>
          {firstWin && (
            <p className={s.firstWin} data-available={firstWin.available > 0}>
              <Trophy aria-hidden size={16} />
              {firstWin.available > 0 ? t('firstWin', { count: firstWin.available }) : t('firstWinTaken')}
            </p>
          )}
        </div>
        <nav className={s.links}>
          {nickname && (
            <Link className={s.link} href={ROUTES.players.profile(nickname)}>
              <UserRound aria-hidden size={16} />
              {t('profile')}
            </Link>
          )}
          {nickname && (
            <Link className={s.link} href={`${ROUTES.players.profile(nickname)}?tab=marks`}>
              <Trophy aria-hidden size={16} />
              {t('marks')}
            </Link>
          )}
          <Link className={s.link} href={ROUTES.account.analytics}>
            <BarChart3 aria-hidden size={16} />
            {t('analytics')}
          </Link>
          <Link className={s.link} href={nickname ? ROUTES.account.watchlist : ROUTES.account.overview}>
            <Eye aria-hidden size={16} />
            {nickname ? t('watchlist') : t('link')}
          </Link>
        </nav>
      </Card>
    </section>
  );
};
