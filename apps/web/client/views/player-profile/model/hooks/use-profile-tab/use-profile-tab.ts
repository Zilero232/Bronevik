'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import type { ProfileTab } from '../../profile.types';

import { PROFILE_TAB_PARAM, PROFILE_TABS } from '../../../config';

export const useProfileTab = () => {
  const [tab, setTab] = useQueryState(
    PROFILE_TAB_PARAM,
    parseAsStringLiteral(PROFILE_TABS).withDefault(PROFILE_TABS[0]).withOptions({ history: 'replace', scroll: false })
  );

  return { tab, setTab: (next: ProfileTab) => void setTab(next) };
};
