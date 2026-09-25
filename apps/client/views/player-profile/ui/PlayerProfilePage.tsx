'use client';

import { match, P } from 'ts-pattern';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';

import type { PlayerProfilePageProps } from './PlayerProfilePage.types';

import { ProfileProvider } from '../model/context';
import { useRememberPlayer } from '../model/hooks';
import { ProfileHero, ProfileMissing, ProfileSkeleton, ProfileTabs } from './components';

import s from './PlayerProfilePage.module.scss';

export const PlayerProfilePage = ({ nickname }: PlayerProfilePageProps) => {
  const { data: profile, isPending, error } = usePlayerProfile(nickname);

  useRememberPlayer(profile);

  return (
    <div className={s.root}>
      {match({ profile, isPending, error })
        .with({ profile: P.nonNullable }, ({ profile: loaded }) => (
          <ProfileProvider profile={loaded}>
            <ProfileHero />
            <ProfileTabs />
          </ProfileProvider>
        ))
        .with({ isPending: true }, () => <ProfileSkeleton />)
        .with({ error: P.when(isNotFoundError) }, () => <ProfileMissing nickname={nickname} reason='notFound' />)
        .otherwise(() => (
          <ProfileMissing nickname={nickname} reason='error' />
        ))}
    </div>
  );
};
