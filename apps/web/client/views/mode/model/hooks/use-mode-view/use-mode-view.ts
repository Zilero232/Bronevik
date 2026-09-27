'use client';

import { useQueryState } from 'nuqs';

import { MODE_VIEW_PARSER } from '../../../config';

export const useModeView = () => useQueryState('view', MODE_VIEW_PARSER.withOptions({ history: 'replace', scroll: false }));
