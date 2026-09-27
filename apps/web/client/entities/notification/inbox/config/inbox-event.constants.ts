import type { NotificationEvent } from '@otmetki/schemas';

import {
  Archive,
  Award,
  BadgePercent,
  CalendarClock,
  ChevronsUp,
  ClipboardList,
  Crown,
  Eye,
  Flag,
  ListChecks,
  Medal,
  Radio,
  Star,
  Store,
  Sun,
  Swords,
  Target,
  Ticket,
  TrendingDown,
  Trophy,
  Users,
  Wrench
} from 'lucide-react';

import type { InboxEventLook } from '../model/inbox.types';

export const INBOX_EVENT = {
  moe_gained: { icon: Star, tone: 'accent' },
  moe_threshold_dropped: { icon: TrendingDown, tone: 'warning' },
  mastery_gained: { icon: Award, tone: 'elite' },
  session_finished: { icon: Flag, tone: 'steel' },
  clan_roster_changed: { icon: Users, tone: 'ally' },
  clan_event_reminder: { icon: CalendarClock, tone: 'warning' },
  clan_weekly_report: { icon: ClipboardList, tone: 'ally' },
  bonus_code: { icon: Ticket, tone: 'premium' },
  premium_offer: { icon: BadgePercent, tone: 'premium' },
  tank_changed: { icon: Wrench, tone: 'steel' },
  goal_reached: { icon: Target, tone: 'success' },
  badge_awarded: { icon: Medal, tone: 'elite' },
  challenge_resolved: { icon: Trophy, tone: 'success' },
  first_win_available: { icon: Sun, tone: 'accent' },
  replay_overflow: { icon: Archive, tone: 'warning' },
  watchlist_digest: { icon: Eye, tone: 'ally' },
  tank_returned: { icon: Store, tone: 'premium' },
  competition_finished: { icon: Swords, tone: 'success' },
  streamer_live: { icon: Radio, tone: 'accent' },
  tank_level_up: { icon: ChevronsUp, tone: 'success' },
  tank_challenge_done: { icon: ListChecks, tone: 'success' },
  plus_checkout_open: { icon: Crown, tone: 'premium' }
} as const satisfies Record<NotificationEvent, InboxEventLook>;
