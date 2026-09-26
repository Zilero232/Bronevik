'use client';

import { useQueryState } from 'nuqs';

import { RNG_PERIOD_PARSER } from '../../../config';

export const useRngPeriod = () => useQueryState('period', RNG_PERIOD_PARSER);
