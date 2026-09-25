'use client';

import { useQueryStates } from 'nuqs';

import { TANKS_QUERY_PARSERS } from '../../config';

export const useTanksState = () => useQueryStates(TANKS_QUERY_PARSERS, { history: 'replace' });
