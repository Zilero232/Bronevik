import { GlobalMapIcon, HeavyTankIcon, Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@otmetki/icons';
import {
  Activity,
  BookOpen,
  CalendarDays,
  Clapperboard,
  Code2,
  Crown,
  Film,
  Flag,
  GitCompareArrows,
  GraduationCap,
  ListChecks,
  MapIcon,
  Network,
  Newspaper,
  Palette,
  Scale,
  ShoppingCart,
  Swords,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
  Wrench
} from 'lucide-react';

import type { SiteNavGroup, SiteNavLink } from './site-nav.types';

import { ROUTES } from '../routes';

export const SITE_NAV = {
  groups: [
    {
      key: 'players',
      featured: null,
      items: [
        { key: 'players', href: ROUTES.players.list, icon: Users },
        { key: 'top', href: ROUTES.top, icon: Trophy },
        { key: 'clans', href: ROUTES.clans.list, icon: StrongholdIcon },
        { key: 'comparePlayers', href: ROUTES.players.compare, icon: GitCompareArrows }
      ]
    },
    {
      key: 'vehicles',
      featured: 'topTank',
      items: [
        { key: 'tanks', href: ROUTES.tanks.list, icon: HeavyTankIcon },
        { key: 'builds', href: ROUTES.builds.list, icon: Wrench },
        { key: 'marks', href: ROUTES.marks, icon: Mark3Icon },
        { key: 'modes', href: ROUTES.modes.list, icon: Flag },
        { key: 'tree', href: ROUTES.tree, icon: Network },
        { key: 'compareTanks', href: ROUTES.tanks.compare, icon: Scale }
      ]
    },
    {
      key: 'game',
      featured: 'currentEvent',
      items: [
        { key: 'missions', href: ROUTES.missions.hub, icon: ListChecks },
        { key: 'events', href: ROUTES.events, icon: CalendarDays },
        { key: 'codes', href: ROUTES.codes, icon: Ticket },
        { key: 'shop', href: ROUTES.shop, icon: ShoppingCart },
        { key: 'news', href: ROUTES.news, icon: Newspaper },
        { key: 'maps', href: ROUTES.maps.list, icon: GlobalMapIcon }
      ]
    },
    {
      key: 'community',
      featured: 'liveStreamers',
      items: [
        { key: 'streamers', href: ROUTES.streamers.list, icon: RadioIcon },
        { key: 'replays', href: ROUTES.replays.list, icon: Film },
        { key: 'guides', href: ROUTES.guides.list, icon: BookOpen },
        { key: 'tactics', href: ROUTES.tactics.list, icon: MapIcon },
        { key: 'platoons', href: ROUTES.platoons, icon: UsersRound },
        { key: 'recruiting', href: ROUTES.recruiting, icon: UserPlus },
        { key: 'coaching', href: ROUTES.coaching.list, icon: GraduationCap },
        { key: 'tournaments', href: ROUTES.tournaments.list, icon: Swords }
      ]
    }
  ],
  tools: { key: 'tools', href: ROUTES.tools, icon: TrainingIcon },
  plus: { key: 'plus', href: ROUTES.plus, icon: Crown }
} as const satisfies { groups: readonly SiteNavGroup[]; tools: SiteNavLink; plus: SiteNavLink };

export const SITE_FOOTER_GROUPS = [
  {
    key: 'project',
    featured: null,
    items: [
      { key: 'tools', href: ROUTES.tools, icon: TrainingIcon },
      { key: 'plus', href: ROUTES.plus, icon: Crown },
      { key: 'forStreamers', href: ROUTES.streamers.forStreamers, icon: Clapperboard },
      { key: 'developers', href: ROUTES.developers, icon: Code2 },
      { key: 'pulse', href: ROUTES.pulse, icon: Activity },
      { key: 'design', href: ROUTES.design, icon: Palette }
    ]
  }
] as const satisfies readonly SiteNavGroup[];
