'use client';

import { useQueryStates } from 'nuqs';

import { MARKS_URL_PARSERS } from '../../../config';

export const useMarksUrlState = () => useQueryStates(MARKS_URL_PARSERS, { history: 'replace' });
