import { Hammer, Newspaper, ScrollText } from 'lucide-react';

export const NEWS = {
  filters: ['all', 'news', 'patch_notes', 'dev_blog'],
  pageSize: 20,
  staleMs: 5 * 60_000,
  skeletons: 6,
  skeletonHeight: 320,
  freshMs: 48 * 60 * 60_000,
  kindTone: { news: 'sky', patch_notes: 'accent', dev_blog: 'gold' },
  kindIcon: { news: Newspaper, patch_notes: ScrollText, dev_blog: Hammer }
} as const;

export const NEWS_EXCERPT = {
  boilerplate: [/читать дальше/giu, /обсудить на форуме/giu, /read more/giu, /discuss on (the )?forum/giu],
  minLength: 12
} as const;
