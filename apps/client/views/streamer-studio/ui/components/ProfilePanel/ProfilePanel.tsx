'use client';

import { Skeleton } from '@/ui-kit';

import { useStreamerProfile } from '../../../model/hooks';
import { ProfileForm } from '../ProfileForm';

export const ProfilePanel = () => {
  const { data: profile, isPending } = useStreamerProfile();

  return isPending ? <Skeleton height={460} shape='block' /> : <ProfileForm key={profile?.slug ?? 'new'} profile={profile ?? null} />;
};
