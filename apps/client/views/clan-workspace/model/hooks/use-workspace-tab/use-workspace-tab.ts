'use client';

import { useQueryState } from 'nuqs';

import { WORKSPACE_TAB_PARSER } from '../../../config';

export const useWorkspaceTab = () => useQueryState('tab', WORKSPACE_TAB_PARSER);
