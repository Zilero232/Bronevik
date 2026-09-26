'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import type { PlayerProfilePageProps } from './PlayerProfilePage.types';

import { ProfileProvider } from '../model/context';
import { useProfilePage } from '../model/hooks';
import { ProfileHeader, ProfileSkeleton, ProfileTabs } from './components';

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
            <ProfileTabs />
            <DataSourceNote updatedAt={loaded.summary.updatedAt} />
          </ProfileProvider>
        ))
        .with({ isPending: true }, () => <ProfileSkeleton />)
        .with({ isNotFound: true }, () => (
          <ResourceMissing
            back={{ href: ROUTES.players, label: t('search') }}
            description={t('notFoundDescription', { nickname })}
            reason='notFound'
            title={t('notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.players, label: t('search') }}
            description={t('errorDescription', { nickname })}
            isRetrying={isRetrying}
            reason='error'
            title={t('errorTitle')}
            onRetry={retry}
          />
        ))}
    </div>
  );
};
