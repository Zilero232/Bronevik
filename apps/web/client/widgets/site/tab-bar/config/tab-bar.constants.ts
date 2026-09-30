import { Mark3Icon } from '@otmetki/icons';
import { Compass, House, UserRound } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const TAB_BAR = {
  tabs: [
    { key: 'home', href: ROUTES.home, icon: House },
    { key: 'search' },
    { key: 'marks', href: ROUTES.marks, icon: Mark3Icon },
    { key: 'me', href: ROUTES.account.overview, icon: UserRound },
    { key: 'more', href: ROUTES.hub, icon: Compass }
  ],
  indicatorId: 'site-tab-bar-indicator',
  iconSize: 20
} as const;
