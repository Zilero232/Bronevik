'use client';

import type { PlayerProfile, RatingPeriod } from '@otmetki/schemas';

import { useState } from 'react';

import type { ProfileContextValue } from '../../context';

import { DEFAULT_PERIOD } from '../../../config';

export const useProfileState = (profile: PlayerProfile): ProfileContextValue => {
  const [period, setPeriod] = useState<RatingPeriod>(DEFAULT_PERIOD);

  const { accountId, nickname } = profile.summary;

  return { profile, accountId, nickname, period, setPeriod };
};
