import type { RouteMatchCallbackOptions } from 'serwist';

import { NetworkOnly } from 'serwist';
import { describe, expect, it } from 'vitest';

import { sameOriginCaching } from '../same-origin-caching';

const ORIGIN = window.location.origin;

const optionsFor = (href: string): RouteMatchCallbackOptions => {
  const url = new URL(href);

  return {
    url,
    sameOrigin: url.origin === ORIGIN,
    request: new Request(url),
    event: Object.assign(new Event('fetch'), { waitUntil: () => undefined })
  };
};

const handler = new NetworkOnly();

describe('sameOriginCaching', () => {
  const caching = sameOriginCaching([
    { matcher: /\.png$/i, handler },
    { matcher: /.*/, handler },
    { matcher: ({ url }) => url.pathname.startsWith('/api/'), handler }
  ]);

  const [images, anything, callback] = caching;

  const matches = (entry: (typeof caching)[number] | undefined, href: string) => Boolean(entry?.matcher(optionsFor(href)));

  it('keeps matching our own requests', () => {
    expect(matches(images, `${ORIGIN}/icons/icon.png`)).toBe(true);
    expect(matches(anything, `${ORIGIN}/tanks`)).toBe(true);
    expect(matches(callback, `${ORIGIN}/api/og/site`)).toBe(true);
  });

  it('never claims a cross-origin request', () => {
    expect(matches(images, 'https://api.tanki.su/static/tank.png')).toBe(false);
    expect(matches(anything, 'https://telegram.org/js/telegram-widget.js?22')).toBe(false);
    expect(matches(callback, 'https://api.example.test/api/players')).toBe(false);
  });
});
