'use client';

import { match } from 'ts-pattern';

import { ErrorState, Skeleton } from '@/ui-kit';

import { useStreamerProfile } from '../../../model/hooks';
import { ProfileForm } from '../ProfileForm';

export const ProfilePanel = () => {
  const { data: profile, isPending, isError, isFetching, refetch } = useStreamerProfile();

  return match({ isPending, isError })
    .with({ isPending: true }, () => <Skeleton height={460} shape='block' />)
    .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
    .otherwise(() => <ProfileForm key={profile?.slug ?? 'new'} profile={profile ?? null} />);
};
