import type { LucideIcon } from 'lucide-react';

import { Heart, Link2, MonitorPlay, Radio, Send, Tv } from 'lucide-react';

export const STREAMER_LINKS = ['twitch', 'vk', 'youtube', 'telegram', 'boosty'] as const;

export type StreamerLinkKey = 'other' | (typeof STREAMER_LINKS)[number];

export const STREAMER_LINK_ICONS = {
  twitch: Tv,
  vk: Radio,
  youtube: MonitorPlay,
  telegram: Send,
  boosty: Heart,
  other: Link2
} as const satisfies Record<StreamerLinkKey, LucideIcon>;

export const STREAMER_PAGE = {
  safeProtocols: new Set(['http:', 'https:']),
  retries: 1,
  percentFormat: { minimumFractionDigits: 1, maximumFractionDigits: 1 }
} as const;
