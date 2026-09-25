import type { NotificationEvent } from '@bronevik/schemas';

import { Award, BadgePercent, CalendarClock, Flag, Medal, Star, Target, Ticket, TrendingDown, Trophy, Users, Wrench } from 'lucide-react';

import type { InboxEventLook } from '../model/inbox.types';

export const INBOX_EVENT = {
  moe_gained: { icon: Star, tone: 'accent' },
  moe_threshold_dropped: { icon: TrendingDown, tone: 'warning' },
  mastery_gained: { icon: Award, tone: 'elite' },
  session_finished: { icon: Flag, tone: 'steel' },
  clan_roster_changed: { icon: Users, tone: 'ally' },
  clan_event_reminder: { icon: CalendarClock, tone: 'warning' },
  bonus_code: { icon: Ticket, tone: 'premium' },
  premium_offer: { icon: BadgePercent, tone: 'premium' },
  tank_changed: { icon: Wrench, tone: 'steel' },
  goal_reached: { icon: Target, tone: 'success' },
  badge_awarded: { icon: Medal, tone: 'elite' },
  challenge_resolved: { icon: Trophy, tone: 'success' }
} as const satisfies Record<NotificationEvent, InboxEventLook>;
