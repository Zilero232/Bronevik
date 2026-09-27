'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Card, DataSourceNote, EmptyState, PageHeader, QueryState, Skeleton } from '@/ui-kit';
import { SessionDetail } from '@/widgets/player/session-detail';

import type { PlayerSessionPageProps } from './PlayerSessionPage.types';

import { useSessionPage } from '../model/hooks';

import s from './PlayerSessionPage.module.scss';

export const PlayerSessionPage = ({ nickname, sessionId }: PlayerSessionPageProps) => {
  const t = useTranslations('profile.sessions');
  const tPlayers = useTranslations('players.head');
  const query = useSessionPage(nickname);

  return (
    <div className={s.root}>
      <PageHeader
        breadcrumbs={[
          { label: tPlayers('title'), href: ROUTES.players.list },
          { label: nickname, href: ROUTES.players.profile(nickname) }
        ]}
        title={t('meta.title', { nickname })}
      />
      <Card padding='lg'>
        <QueryState
          isCompact
          empty={<EmptyState isCompact title={t('errorTitle')} />}
          errorTitle={t('errorTitle')}
          isEmpty={(summary) => summary === null}
          query={query}
          skeleton={<Skeleton height={360} shape='block' />}
        >
          {(summary) => summary && <SessionDetail accountId={summary.accountId} nickname={summary.nickname} sessionId={sessionId} />}
        </QueryState>
      </Card>
      <DataSourceNote />
    </div>
  );
};
