import { Megaphone, MessagesSquare, Radar, RefreshCw, ScrollText, Trophy } from 'lucide-react';

import type { StoryCardTone } from '@/ui-kit';

import type { BlogCategory } from '../api';

import { zBlogArticle } from '../api';

export const BLOG_CATEGORIES = zBlogArticle.shape.post.shape.category.options;

export const BLOG_CATEGORY_TONE = {
  announcements: 'accent',
  updates: 'sky',
  analysis: 'gold',
  patches: 'battle',
  community: 'olive',
  esports: 'brass'
} as const satisfies Record<BlogCategory, StoryCardTone>;

export const BLOG_CATEGORY_ICON = {
  announcements: Megaphone,
  updates: RefreshCw,
  analysis: Radar,
  patches: ScrollText,
  community: MessagesSquare,
  esports: Trophy
} as const satisfies Record<BlogCategory, unknown>;

export const BLOG_ACCESS = {
  staleMs: 5 * 60_000,
  skeletonHeight: 240
} as const;
