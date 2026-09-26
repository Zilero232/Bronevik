import type { StreamerChannel } from '@otmetki/schemas';

import { STREAMER_PLATFORMS } from '@otmetki/schemas';
import { sortBy } from 'remeda';

import { safeWebHref } from '@/shared/lib';

export const channelLinks = (channels: readonly StreamerChannel[]): StreamerChannel[] =>
  sortBy(
    channels.flatMap((channel) => {
      const url = safeWebHref(channel.url);

      return url ? [{ ...channel, url }] : [];
    }),
    ({ platform }) => STREAMER_PLATFORMS.indexOf(platform),
    ({ verified }) => (verified ? 0 : 1)
  );
