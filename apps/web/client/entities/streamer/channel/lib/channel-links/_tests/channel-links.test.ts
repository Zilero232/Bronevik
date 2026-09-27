import type { StreamerChannel } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { channelLinks } from '../channel-links';

const channel = (patch: Partial<StreamerChannel>): StreamerChannel => ({
  platform: 'twitch',
  handle: 'nick',
  url: 'https://twitch.tv/nick',
  verified: false,
  ...patch
});

describe('channelLinks', () => {
  it('returns nothing for a page without channels', () => {
    expect(channelLinks([])).toEqual([]);
  });

  it('drops channels whose address is not a web link', () => {
    const links = channelLinks([channel({ url: 'javascript:alert(1)' }), channel({ platform: 'youtube', url: 'https://youtube.com/@nick' })]);

    expect(links.map(({ platform }) => platform)).toEqual(['youtube']);
  });

  it('orders channels by platform, verified ones first', () => {
    const links = channelLinks([
      channel({ platform: 'telegram', url: 'https://t.me/nick' }),
      channel({ handle: 'alt', url: 'https://twitch.tv/alt' }),
      channel({ verified: true })
    ]);

    expect(links.map(({ platform, handle }) => `${platform}:${handle}`)).toEqual(['twitch:nick', 'twitch:alt', 'telegram:nick']);
  });
});
