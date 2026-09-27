import { Clapperboard, Radio, SlidersHorizontal } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const STREAMERS_HUB = [
  { key: 'live', href: ROUTES.streamers.list, icon: Radio },
  { key: 'settings', href: ROUTES.streamers.settings.table, icon: SlidersHorizontal },
  { key: 'forStreamers', href: ROUTES.streamers.forStreamers, icon: Clapperboard }
] as const;
