import { GlobalMapIcon, HeavyTankIcon, Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@otmetki/icons';
import {
  Activity,
  BookOpen,
  CalendarDays,
  Code2,
  Film,
  GraduationCap,
  ListChecks,
  MapIcon,
  Newspaper,
  ShoppingCart,
  Swords,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
  Wrench
} from 'lucide-react';

import type { SiteNavKey } from './site-nav';
import type { SiteNavIcon } from './site-nav.types';

export const SITE_NAV_ICONS = {
  players: Users,
  tanks: HeavyTankIcon,
  builds: Wrench,
  marks: Mark3Icon,
  missions: ListChecks,
  top: Trophy,
  clans: StrongholdIcon,
  maps: GlobalMapIcon,
  tools: TrainingIcon,
  news: Newspaper,
  events: CalendarDays,
  shop: ShoppingCart,
  codes: Ticket,
  pulse: Activity,
  streamers: RadioIcon,
  developers: Code2,
  replays: Film,
  guides: BookOpen,
  tactics: MapIcon,
  platoons: UsersRound,
  recruiting: UserPlus,
  coaching: GraduationCap,
  tournaments: Swords
} as const satisfies Record<SiteNavKey, SiteNavIcon>;
