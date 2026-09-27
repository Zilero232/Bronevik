import { Bell, ChartColumn, Code2, CreditCard, Eye, History, LayoutDashboard, Palette, Radio, Send, Swords } from 'lucide-react';

import type { AccountNavGroup } from './account-nav.types';

import { ROUTES } from '../routes';

export const ACCOUNT_NAV = [
  {
    key: 'profile',
    items: [
      { key: 'overview', href: ROUTES.account.overview, icon: LayoutDashboard },
      { key: 'analytics', href: ROUTES.account.analytics, icon: ChartColumn },
      { key: 'battles', href: ROUTES.account.battles, icon: Swords },
      { key: 'progress', href: ROUTES.account.progress, icon: History },
      { key: 'cosmetics', href: ROUTES.account.cosmetics, icon: Palette }
    ]
  },
  {
    key: 'subscriptions',
    items: [
      { key: 'watchlist', href: ROUTES.account.watchlist, icon: Eye },
      { key: 'notifications', href: ROUTES.account.notifications, icon: Bell },
      { key: 'telegram', href: ROUTES.account.telegram, icon: Send }
    ]
  },
  {
    key: 'account',
    items: [
      { key: 'billing', href: ROUTES.account.billing, icon: CreditCard },
      { key: 'streamer', href: ROUTES.account.streamer, icon: Radio },
      { key: 'developer', href: ROUTES.account.developer, icon: Code2 }
    ]
  }
] as const satisfies readonly AccountNavGroup[];
