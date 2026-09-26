import type { WatchlistDigest, WatchlistSettings } from '@otmetki/schemas';
import { watchlistControllerUpdateSettings } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const updateWatchlistSettings = (digest: WatchlistDigest): Promise<WatchlistSettings> =>
  fromSdk(() => watchlistControllerUpdateSettings({ ...SESSION_REQUEST, body: { digest } }));
