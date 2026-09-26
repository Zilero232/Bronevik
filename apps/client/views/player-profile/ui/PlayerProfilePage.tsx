'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import type { PlayerProfilePageProps } from './PlayerProfilePage.types';

import { ProfileProvider } from '../model/context';
import { useProfilePage } from '../model/hooks';
import { ProfileActionStrip, ProfileHeader, ProfileSkeleton, ProfileTabs } from './components';

import s from './PlayerProfilePage.module.scss';

export const PlayerProfilePage = ({ nickname }: PlayerProfilePageProps) => {
  const t = useTranslations('profile.missing');
  const { profile, isPending, isNotFound, isRetrying, retry } = useProfilePage(nickname);

  return (
    <div className={s.root}>
      {match({ profile, isPending, isNotFound })
        .with({ profile: P.nonNullable }, ({ profile: loaded }) => (
          <ProfileProvider profile={loaded}>
            <ProfileHeader />
            <ProfileActionStrip />
            <div className={s.body}>
              <ProfileTabs />
              <DataSourceNote updatedAt={loaded.summary.updatedAt} />
            </div>
          </ProfileProvider>
        ))
        .with({ isPending: true }, () => (
          <div className={s.body}>
            <ProfileSkeleton />
          </div>
        ))
        .with({ isNotFound: true }, () => (
          <div className={s.body}>
            <ResourceMissing
              back={{ href: ROUTES.players.list, label: t('search') }}
              description={t('notFoundDescription', { nickname })}
              reason='notFound'
              title={t('notFoundTitle')}
            />
          </div>
        ))
        .otherwise(() => (
          <div className={s.body}>
            <ResourceMissing
              back={{ href: ROUTES.players.list, label: t('search') }}
              description={t('errorDescription', { nickname })}
              isRetrying={isRetrying}
              reason='error'
              title={t('errorTitle')}
              onRetry={retry}
            />
          </div>
        ))}
    </div>
  );
};
