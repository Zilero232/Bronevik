import { describe, expect, it } from 'vitest';

import { isPublicUrl, playerUrl, statCardUrl } from '../site-url';

describe('site urls', () => {
  it('only treats public https urls as usable in Telegram buttons', () => {
    expect(isPublicUrl('https://otmetki.app/p/Tanker')).toBe(true);
    expect(isPublicUrl('http://otmetki.app')).toBe(false);
    expect(isPublicUrl('https://localhost:3000')).toBe(false);
    expect(isPublicUrl('not a url')).toBe(false);
  });

  it('escapes the nickname and points the stat card at the site og route', () => {
    expect(playerUrl({ webUrl: 'https://otmetki.app', nickname: 'a b' })).toBe('https://otmetki.app/p/a%20b');
    expect(statCardUrl({ webUrl: 'https://otmetki.app', accountId: 42n })).toBe('https://otmetki.app/api/og/player/42');
  });
});
