import type { StreamerPlatform } from '@otmetki/schemas';
import type { LucideIcon } from 'lucide-react';

import { Gamepad2, Heart, MonitorPlay, Radio, Send, Tv, Users } from 'lucide-react';

export const PLATFORM_ICONS = {
  twitch: Tv,
  vkVideoLive: Radio,
  youtube: MonitorPlay,
  trovo: Gamepad2,
  telegram: Send,
  boosty: Heart,
  vk: Users
} as const satisfies Record<StreamerPlatform, LucideIcon>;

export const CHANNEL_CHIP = {
  iconSize: 14,
  verifiedSize: 13
} as const;
