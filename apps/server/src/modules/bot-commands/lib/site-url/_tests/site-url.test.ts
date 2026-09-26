import { describe, expect, it } from 'vitest';

import { isPublicUrl, playerUrl, statCardUrl } from '../site-url';

describe('site urls', () => {
  it('only treats public https urls as usable in Telegram buttons', () => {
    expect(isPublicUrl('https://triotmetki.ru/p/Tanker')).toBe(true);
    expect(isPublicUrl('http://triotmetki.ru')).toBe(false);
    expect(isPublicUrl('https://localhost:3000')).toBe(false);
    expect(isPublicUrl('not a url')).toBe(false);
  });

  it('escapes the nickname and points the stat card at the site og route', () => {
    expect(playerUrl({ webUrl: 'https://triotmetki.ru', nickname: 'a b' })).toBe('https://triotmetki.ru/p/a%20b');
    expect(statCardUrl({ webUrl: 'https://triotmetki.ru', accountId: 42n })).toBe('https://triotmetki.ru/api/og/player/42');
  });
});
