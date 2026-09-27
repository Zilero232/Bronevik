'use client';

import { QueryState, Skeleton } from '@/ui-kit';

import { useStreamerProfile } from '../../../model/hooks';
import { ProfileForm } from '../ProfileForm';

export const ProfilePanel = () => {
  const query = useStreamerProfile();

  return (
    <QueryState query={query} skeleton={<Skeleton height={460} shape='block' />}>
      {(profile) => <ProfileForm key={profile?.slug ?? 'new'} profile={profile} />}
    </QueryState>
  );
};
