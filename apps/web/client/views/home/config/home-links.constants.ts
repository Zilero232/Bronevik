import { CrewCommanderIcon, Mark3Icon, RadioIcon, StrongholdIcon } from '@otmetki/icons';
import { Activity, Download, ListChecks, Newspaper, NotebookPen, ScrollText, Swords, Tag, Ticket, Wrench } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const HOME_ACTIONS = [
  { key: 'marks', href: ROUTES.marks, icon: Mark3Icon, tone: 'gold' },
  { key: 'builds', href: ROUTES.builds.list, icon: Wrench, tone: 'sky' },
  { key: 'missions', href: ROUTES.missions.hub, icon: ListChecks, tone: 'olive' },
  { key: 'codes', href: ROUTES.codes, icon: Ticket, tone: 'brass' },
  { key: 'tournaments', href: ROUTES.tournaments.list, icon: Swords, tone: 'battle' }
] as const;

export const HOME_FIGURES = {
  tracked: { icon: CrewCommanderIcon, tone: 'accent' },
  online: { icon: Activity, tone: 'olive' },
  version: { icon: Tag, tone: 'sky' }
} as const;

export const HOME_CTA = { href: ROUTES.mod, icon: Download } as const;

export const HOME_COMMUNITY = [
  { key: 'streamers', href: ROUTES.streamers.list, icon: RadioIcon },
  { key: 'clans', href: ROUTES.clans.list, icon: StrongholdIcon }
] as const;

export const NEWS_KIND_ICON = {
  news: Newspaper,
  patch_notes: ScrollText,
  dev_blog: NotebookPen
} as const;

export const HOME_ICON = { action: 18, cta: 18, emblem: 160, community: 220, figure: 16 } as const;
