import { Award, Rss, Target } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const SOCIAL_SECTIONS = [
  { key: 'feed', href: ROUTES.social.feed, icon: Rss },
  { key: 'leagues', href: ROUTES.social.leagues, icon: Award },
  { key: 'challenges', href: ROUTES.social.challenges, icon: Target }
] as const;

export const SOCIAL_SHELL = {
  skeletonHeights: [48, 360],
  emblemSize: 480,
  emblemStroke: 1.25
} as const;
