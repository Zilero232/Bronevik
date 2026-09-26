'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import type { ShopTab } from './use-shop-tab.types';

import { SHOP } from '../../../config';

export const useShopTab = () => {
  const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(SHOP.tabs).withDefault('current').withOptions({ history: 'replace' }));

  return { tab, setTab: (next: ShopTab) => void setTab(next) };
};
