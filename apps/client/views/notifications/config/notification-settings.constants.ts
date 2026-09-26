import type { NotificationChannel, NotificationEvent } from '@otmetki/schemas';
import type { LucideIcon } from 'lucide-react';

import { Globe, Mail, Send, Smartphone } from 'lucide-react';

export const NOTIFICATION_CHANNELS = [
  { channel: 'site', icon: Globe },
  { channel: 'telegram', icon: Send },
  { channel: 'email', icon: Mail },
  { channel: 'web_push', icon: Smartphone }
] as const satisfies readonly { channel: NotificationChannel; icon: LucideIcon }[];

export const EVENT_GROUPS = {
  marks: ['moe_gained', 'moe_threshold_dropped', 'mastery_gained'],
  battles: ['session_finished', 'goal_reached', 'badge_awarded'],
  clan: ['clan_roster_changed', 'clan_event_reminder', 'clan_weekly_report'],
  offers: ['bonus_code', 'premium_offer', 'tank_changed'],
  streams: ['challenge_resolved']
} as const satisfies Record<string, readonly NotificationEvent[]>;
