'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Card, DataSourceNote, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';
import { SessionDetail } from '@/widgets/player/session-detail';

import type { PlayerSessionPageProps } from './PlayerSessionPage.types';

import { useSessionPage } from '../model/hooks';

import s from './PlayerSessionPage.module.scss';

export const PlayerSessionPage = ({ nickname, sessionId }: PlayerSessionPageProps) => {
  const t = useTranslations('profile.sessions');
  const tPlayers = useTranslations('players.head');
  const { summary, status, isRetrying, retry } = useSessionPage(nickname);

  return (
    <div className={s.root}>
      <PageHeader
        breadcrumbs={[
          { label: tPlayers('title'), href: ROUTES.players },
          { label: nickname, href: ROUTES.player(nickname) }
        ]}
        title={t('meta.title', { nickname })}
      />
      <Card padding='lg'>
        {match(status)
          .with('loading', () => <Skeleton height={360} shape='block' />)
          .with('missing', () => <EmptyState isCompact title={t('errorTitle')} />)
          .with('error', () => <ErrorState isCompact isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />)
          .otherwise(() => summary && <SessionDetail accountId={summary.accountId} nickname={summary.nickname} sessionId={sessionId} />)}
      </Card>
      <DataSourceNote />
    </div>
  );
};
