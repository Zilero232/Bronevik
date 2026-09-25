'use client';

import { useQueryState } from 'nuqs';

import { TANK_URL_PARSERS } from '../../config';

export const useTankPeriod = () => useQueryState('period', TANK_URL_PARSERS.period.withOptions({ history: 'replace', scroll: false }));
