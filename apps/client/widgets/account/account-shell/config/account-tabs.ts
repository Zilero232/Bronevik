import { Bell, Braces, Crown, LayoutDashboard, Radio, Send } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const ACCOUNT_TABS = [
  { key: 'overview', href: ROUTES.me, icon: LayoutDashboard },
  { key: 'notifications', href: ROUTES.account.notifications, icon: Bell },
  { key: 'billing', href: ROUTES.account.billing, icon: Crown },
  { key: 'telegram', href: ROUTES.account.telegram, icon: Send },
  { key: 'developer', href: ROUTES.account.developer, icon: Braces },
  { key: 'streamer', href: ROUTES.account.streamer, icon: Radio }
] as const;
