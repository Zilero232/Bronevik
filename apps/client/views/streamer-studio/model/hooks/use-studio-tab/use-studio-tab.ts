'use client';

import { useQueryState } from 'nuqs';

import { STUDIO_QUERY, STUDIO_TAB_PARSER } from '../../../config';

export const useStudioTab = () => useQueryState(STUDIO_QUERY.tab, STUDIO_TAB_PARSER.withOptions({ history: 'replace', scroll: false }));
