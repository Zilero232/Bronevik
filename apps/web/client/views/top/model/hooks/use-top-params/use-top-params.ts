'use client';

import { useQueryStates } from 'nuqs';

import { TOP_PARAMS } from '../../../config';

export const useTopParams = () => useQueryStates(TOP_PARAMS, { history: 'replace' });
