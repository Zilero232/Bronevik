import { describe, expect, it } from 'vitest';

import { isPublicUrl, playerUrl, statCardUrl } from '../site-url';

describe('site urls', () => {
  it('only treats public https urls as usable in Telegram buttons', () => {
    expect(isPublicUrl('https://bronevik.app/p/Tanker')).toBe(true);
    expect(isPublicUrl('http://bronevik.app')).toBe(false);
    expect(isPublicUrl('https://localhost:3000')).toBe(false);
    expect(isPublicUrl('not a url')).toBe(false);
  });

  it('escapes the nickname and points the stat card at the site og route', () => {
    expect(playerUrl({ webUrl: 'https://bronevik.app', nickname: 'a b' })).toBe('https://bronevik.app/p/a%20b');
    expect(statCardUrl({ webUrl: 'https://bronevik.app', accountId: 42n })).toBe('https://bronevik.app/api/og/player/42');
  });
});
