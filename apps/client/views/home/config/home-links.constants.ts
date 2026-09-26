import { Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@otmetki/icons';
import { ListChecks, Newspaper, NotebookPen, ScrollText, Swords, Ticket, Wrench } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const HOME_ACTIONS = [
  { key: 'marks', href: ROUTES.marks, icon: Mark3Icon },
  { key: 'builds', href: ROUTES.builds.list, icon: Wrench },
  { key: 'missions', href: ROUTES.missions.hub, icon: ListChecks },
  { key: 'codes', href: ROUTES.codes, icon: Ticket },
  { key: 'tournaments', href: ROUTES.tournaments.list, icon: Swords }
] as const;

export const HOME_CTA = { href: ROUTES.tools, icon: TrainingIcon } as const;

export const HOME_COMMUNITY = [
  { key: 'streamers', href: ROUTES.streamers.forStreamers, icon: RadioIcon },
  { key: 'clans', href: ROUTES.clans.list, icon: StrongholdIcon }
] as const;

export const NEWS_KIND_ICON = {
  news: Newspaper,
  patch_notes: ScrollText,
  dev_blog: NotebookPen
} as const;

export const HOME_ICON = { action: 18, cta: 18, emblem: 160, community: 220, figure: 16 } as const;
