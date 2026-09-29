import { GlobalMapIcon, HeavyTankIcon, Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@otmetki/icons';
import {
  Activity,
  Award,
  BookOpen,
  CalendarDays,
  Clapperboard,
  Code2,
  Crown,
  Dices,
  Download,
  Film,
  Flag,
  Flame,
  FlaskConical,
  Gamepad2,
  GitCompareArrows,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  ListChecks,
  MapIcon,
  Medal,
  Network,
  Newspaper,
  Palette,
  Scale,
  ShoppingCart,
  Sigma,
  Swords,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
  Wrench
} from 'lucide-react';
import { isIncludedIn } from 'remeda';

import type { SiteFooterAction, SiteNavGroup, SiteNavLink } from './site-nav.types';

import { ROUTES } from '../routes';

export const SITE_NAV = {
  groups: [
    {
      key: 'players',
      featured: null,
      items: [
        { key: 'players', href: ROUTES.players.list, icon: Users },
        { key: 'top', href: ROUTES.top, icon: Trophy },
        { key: 'bestBattles', href: ROUTES.bestBattles, icon: Flame },
        { key: 'achievements', href: ROUTES.achievements, icon: Medal },
        { key: 'comparePlayers', href: ROUTES.players.compare, icon: GitCompareArrows },
        { key: 'honestRng', href: ROUTES.honestRng, icon: Dices }
      ]
    },
    {
      key: 'clans',
      featured: null,
      items: [
        { key: 'clans', href: ROUTES.clans.list, icon: StrongholdIcon },
        { key: 'platoons', href: ROUTES.platoons, icon: UsersRound },
        { key: 'recruiting', href: ROUTES.recruiting, icon: UserPlus },
        { key: 'coaching', href: ROUTES.coaching.list, icon: GraduationCap }
      ]
    },
    {
      key: 'vehicles',
      featured: 'topTank',
      items: [
        { key: 'catalog', href: ROUTES.tanks.catalog, icon: LayoutGrid },
        { key: 'tanks', href: ROUTES.tanks.list, icon: HeavyTankIcon },
        { key: 'builds', href: ROUTES.builds.list, icon: Wrench },
        { key: 'marks', href: ROUTES.marks, icon: Mark3Icon },
        { key: 'tree', href: ROUTES.tree, icon: Network },
        { key: 'supertest', href: ROUTES.supertest, icon: FlaskConical },
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
        { key: 'maps', href: ROUTES.maps.list, icon: GlobalMapIcon },
        { key: 'modes', href: ROUTES.modes.list, icon: Flag }
      ]
    },
    {
      key: 'community',
      featured: 'liveStreamers',
      items: [
        { key: 'competitions', href: ROUTES.social.leagues, icon: Award },
        { key: 'streamers', href: ROUTES.streamers.list, icon: RadioIcon },
        { key: 'replays', href: ROUTES.replays.list, icon: Film },
        { key: 'guides', href: ROUTES.guides.list, icon: BookOpen },
        { key: 'tactics', href: ROUTES.tactics.list, icon: MapIcon },
        { key: 'tournaments', href: ROUTES.tournaments.list, icon: Swords },
        { key: 'play', href: ROUTES.play.hub, icon: Gamepad2 }
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
      { key: 'mod', href: ROUTES.mod, icon: Download },
      { key: 'tools', href: ROUTES.tools, icon: TrainingIcon },
      { key: 'plus', href: ROUTES.plus, icon: Crown },
      { key: 'forStreamers', href: ROUTES.streamers.forStreamers, icon: Clapperboard },
      { key: 'developers', href: ROUTES.developers, icon: Code2 },
      { key: 'pulse', href: ROUTES.pulse, icon: Activity },
      { key: 'ratings', href: ROUTES.ratings, icon: Sigma },
      { key: 'status', href: ROUTES.status, icon: HeartPulse },
      { key: 'design', href: ROUTES.design, icon: Palette }
    ]
  }
] as const satisfies readonly SiteNavGroup[];

export const SITE_FOOTER_ACTION_KEYS = ['mod', 'tools', 'plus'] as const;

export const SITE_FOOTER_ACTIONS = SITE_FOOTER_GROUPS.flatMap(({ items }) => [...items]).filter((item): item is SiteFooterAction =>
  isIncludedIn(item.key, SITE_FOOTER_ACTION_KEYS)
);

export const SITE_FOOTER_COLUMNS = [
  ...SITE_NAV.groups,
  ...SITE_FOOTER_GROUPS.map((group) => ({ ...group, items: group.items.filter(({ key }) => !isIncludedIn(key, SITE_FOOTER_ACTION_KEYS)) }))
];

export const SITE_LEGAL_LINKS = [
  { key: 'contacts', href: ROUTES.legal.contacts },
  { key: 'terms', href: ROUTES.legal.terms },
  { key: 'privacy', href: ROUTES.legal.privacy }
] as const;
