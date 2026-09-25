'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePlayerProfile } from '@/entities/player/profile';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { EmptyState, Skeleton } from '@/ui-kit';
import { SessionDetail } from '@/widgets/player/session-detail';

import type { PlayerSessionPageProps } from './PlayerSessionPage.types';

import s from './PlayerSessionPage.module.scss';

export const PlayerSessionPage = ({ nickname, sessionId }: PlayerSessionPageProps) => {
  const t = useTranslations('profile.sessions');
  const { data: profile, isPending, isError } = usePlayerProfile(nickname);

  return (
    <div className={s.root}>
      <Link className={s.back} href={ROUTES.player(nickname)}>
        <ArrowLeft size={16} />
        {t('back', { nickname })}
      </Link>
      {isPending && <Skeleton height={480} shape='block' />}
      {isError && <EmptyState description={t('errorDescription')} title={t('errorTitle')} />}
      {profile && (
        <div className={s.card}>
          <SessionDetail accountId={profile.summary.accountId} nickname={profile.summary.nickname} sessionId={sessionId} />
        </div>
      )}
    </div>
  );
};
