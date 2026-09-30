'use client';

import { usePathname } from '@/shared/i18n/navigation';

import { activeTabKey } from '../../../lib/tab-match';

export const useTabBar = () => {
  const pathname = usePathname();

  return { activeKey: activeTabKey(pathname) };
};
