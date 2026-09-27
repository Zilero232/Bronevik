'use client';

import { createContext, use } from 'react';

import type { ProfileContextValue } from './profile-context.types';

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export const useProfileContext = () => {
  const value = use(ProfileContext);

  if (!value) {
    throw new Error('useProfileContext must be used inside ProfileProvider');
  }

  return value;
};
