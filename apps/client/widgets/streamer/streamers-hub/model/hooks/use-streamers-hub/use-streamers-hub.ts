'use client';

import { usePathname } from '@/shared/i18n/navigation';

import { STREAMERS_HUB } from '../../../config';
import { isHubActive } from '../../../lib/hub-active';

export const useStreamersHub = () => {
  const pathname = usePathname();

  return STREAMERS_HUB.map((item) => ({ ...item, isActive: isHubActive({ href: item.href, pathname }) }));
};
