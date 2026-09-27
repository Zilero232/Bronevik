'use client';

import type { ProfileProviderProps } from './ProfileProvider.types';

import { ProfileContext } from '../../../model/context';
import { useProfileState } from '../../../model/hooks';

export const ProfileProvider = ({ profile, children }: ProfileProviderProps) => {
  const value = useProfileState(profile);

  return <ProfileContext value={value}>{children}</ProfileContext>;
};
