'use client';

import type { RatingPeriod } from '@bronevik/schemas';

import { useState } from 'react';

import type { ProfileProviderProps } from './profile-context.types';

import { DEFAULT_PERIOD } from '../../config';
import { ProfileContext } from './profile-context';

export const ProfileProvider = ({ profile, children }: ProfileProviderProps) => {
  const [period, setPeriod] = useState<RatingPeriod>(DEFAULT_PERIOD);

  const { accountId, nickname } = profile.summary;

  return <ProfileContext value={{ profile, accountId, nickname, period, setPeriod }}>{children}</ProfileContext>;
};
