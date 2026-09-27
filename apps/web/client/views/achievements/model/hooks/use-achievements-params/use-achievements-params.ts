'use client';

import { useQueryStates } from 'nuqs';

import { ACHIEVEMENTS_PARAMS } from '../../../config';

export const useAchievementsParams = () => useQueryStates(ACHIEVEMENTS_PARAMS, { history: 'replace' });
