import type { FeedState } from '../lib/feed-state';

export const OVERLAY_FEED = {
  pollMs: 10_000,
  retries: 2
} as const;

export const INITIAL_FEED_STATE = { transport: 'stream', data: null } as const satisfies FeedState;
