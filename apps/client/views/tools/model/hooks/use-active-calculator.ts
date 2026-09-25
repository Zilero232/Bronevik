'use client';

import { useQueryState } from 'nuqs';

import { CALC_URL_PARSER } from '../../config';

export const useActiveCalculator = () => useQueryState('calc', CALC_URL_PARSER.withOptions({ history: 'replace', scroll: false }));
