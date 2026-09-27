import type { WatchlistDigest } from '@otmetki/schemas';

export type DigestSettingsProps = {
  digest: WatchlistDigest;
  lastDigestAt: string | null;
};
