import { parseAsStringLiteral } from 'nuqs';

import type { BadgeTone } from '@/ui-kit';

import type { SocialFeedKind } from '../api';

export const FEED_DAYS = ['7', '14', '30'] as const;

export const FEED_KINDS = ['mark', 'mastery', 'record', 'badge'] as const satisfies readonly SocialFeedKind[];

export const FEED_FILTERS = ['all', ...FEED_KINDS] as const;

export const FEED_PARSERS = {
  days: parseAsStringLiteral(FEED_DAYS).withDefault('14').withOptions({ history: 'replace' }),
  kind: parseAsStringLiteral(FEED_FILTERS).withDefault('all').withOptions({ history: 'replace' })
} as const;

export const FEED_VIEW = {
  staleMs: 60_000,
  skeletonHeight: 420
} as const;

export const FEED_KIND_TONES = {
  mark: 'accent',
  mastery: 'premium',
  record: 'success',
  badge: 'steel'
} as const satisfies Record<SocialFeedKind, BadgeTone>;
