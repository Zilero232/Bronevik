import { sortBy } from 'remeda';

import type { StreamerLink } from './streamer-links.types';

import { STREAMER_LINKS, STREAMER_PAGE } from '../../config';

const isSafeUrl = (url: string) => {
  try {
    return STREAMER_PAGE.safeProtocols.has(new URL(url).protocol);
  } catch {
    return false;
  }
};

const keyOf = (name: string): StreamerLink['key'] => STREAMER_LINKS.find((known) => known === name) ?? 'other';

export const toStreamerLinks = (links: Record<string, string> | null): StreamerLink[] => {
  const safe = Object.entries(links ?? {})
    .filter(([, url]) => isSafeUrl(url))
    .map(([name, url]) => ({ key: keyOf(name), url }));

  return sortBy(safe, ({ key }) => (key === 'other' ? STREAMER_LINKS.length : STREAMER_LINKS.indexOf(key)));
};
