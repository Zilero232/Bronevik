import { describe, expect, it } from 'vitest';

import { blogFeedLink } from '../feed-link';

const WEB_URL = 'https://triotmetki.ru';

describe('blogFeedLink', () => {
  it('links a Russian post without a locale prefix', () => {
    expect(blogFeedLink({ webUrl: WEB_URL, locale: 'ru', slug: 'patch-1-45' })).toBe(`${WEB_URL}/blog/patch-1-45`);
  });

  it('links an English post under the /en prefix', () => {
    expect(blogFeedLink({ webUrl: WEB_URL, locale: 'en', slug: 'patch-1-45' })).toBe(`${WEB_URL}/en/blog/patch-1-45`);
  });

  it('links the blog index when no slug is given', () => {
    expect(blogFeedLink({ webUrl: WEB_URL, locale: 'ru' })).toBe(`${WEB_URL}/blog`);
  });
});
