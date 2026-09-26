'use client';

import { useQueryStates } from 'nuqs';

import { BEST_BATTLES_URL_PARSERS } from '../../../config';

export const useBestBattlesState = () => useQueryStates(BEST_BATTLES_URL_PARSERS, { history: 'replace' });
