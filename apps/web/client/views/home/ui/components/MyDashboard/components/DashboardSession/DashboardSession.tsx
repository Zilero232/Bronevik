'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, RelativeTime, SkeletonStack, StatList } from '@/ui-kit';

import type { DashboardSessionProps } from './DashboardSession.types';

import { HOME, HOME_ICON } from '../../../../../config';
import { useDashboardSession } from '../../../../../model/hooks';

import s from './DashboardSession.module.scss';

export const DashboardSession = ({ nickname, session }: DashboardSessionProps) => {
  const t = useTranslations('home.dashboard.session');
  const { items, startedAt } = useDashboardSession(session);

  return (
    <article className={s.root}>
      <header className={s.head}>
        <h3 className={s.title}>{t('title')}</h3>
        {session?.isLive ? <Badge tone='success'>{t('live')}</Badge> : <RelativeTime className={s.time} value={startedAt} />}
      </header>
      {session === undefined && <SkeletonStack heights={HOME.dashboard.skeleton.session} />}
      {session === null && <p className={s.empty}>{t('empty')}</p>}
      {session && (
        <>
          <StatList className={s.stats} items={items} />
          <Link className={s.more} href={ROUTES.players.session({ nickname, sessionId: session.id })}>
            {t('open')}
            <ChevronRight aria-hidden size={HOME_ICON.more} />
          </Link>
        </>
      )}
    </article>
  );
};
