import { describe, expect, it } from 'vitest';

import { STREAMER_LINKS } from '../../../config';
import { toStreamerLinks } from '../streamer-links';

describe('toStreamerLinks', () => {
  it('returns nothing for a profile without links', () => {
    expect(toStreamerLinks(null)).toEqual([]);
  });

  it('drops links that are not plain web addresses', () => {
    const links = toStreamerLinks({ twitch: 'javascript:alert(1)', vk: 'not a url', youtube: 'https://youtube.com/@x' });

    expect(links.map(({ key }) => key)).toEqual(['youtube']);
  });

  it('orders known channels the same way every time, with unknown ones last', () => {
    const links = toStreamerLinks({ site: 'https://example.com', telegram: 'https://t.me/x', twitch: 'https://twitch.tv/x' });
    const keys = links.map(({ key }) => key);

    expect(keys.at(-1)).toBe('other');
    expect(STREAMER_LINKS.indexOf('twitch')).toBeLessThan(STREAMER_LINKS.indexOf('telegram'));
    expect(keys.indexOf('twitch')).toBeLessThan(keys.indexOf('telegram'));
  });
});
