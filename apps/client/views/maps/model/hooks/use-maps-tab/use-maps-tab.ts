'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import type { MapsTab } from './use-maps-tab.types';

import { MAPS_TABS } from '../../../config';

export const useMapsTab = () => {
  const [tab, setTab] = useQueryState(
    MAPS_TABS.param,
    parseAsStringLiteral(MAPS_TABS.values).withDefault(MAPS_TABS.initial).withOptions({ history: 'replace' })
  );

  return { tab, setTab: (next: MapsTab) => void setTab(next) };
};
