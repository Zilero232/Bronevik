import type { BonusCodeVerdict as BonusCodeVerdictView } from '@otmetki/schemas';

import { invert } from 'remeda';

import type { BonusCodeVerdict, NewsKind } from '../../../../../generated';

export const NEWS_KIND_FROM_DB = {
  news: 'news',
  patchNotes: 'patch_notes',
  devBlog: 'dev_blog'
} as const satisfies Record<NewsKind, string>;

export const NEWS_KIND_TO_DB = invert(NEWS_KIND_FROM_DB) satisfies Record<(typeof NEWS_KIND_FROM_DB)[NewsKind], NewsKind>;

export const VERDICT_TO_DB = {
  working: 'working',
  expired: 'expired',
  already_used: 'alreadyUsed'
} as const satisfies Record<BonusCodeVerdictView, BonusCodeVerdict>;
