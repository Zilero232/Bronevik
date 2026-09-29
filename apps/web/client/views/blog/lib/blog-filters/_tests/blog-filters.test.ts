import { describe, expect, it } from 'vitest';

import { blogRssHref, toggledTag } from '../blog-filters';

describe('blogRssHref', () => {
  it('points at the feed on the API origin', () => {
    expect(blogRssHref('https://api.triotmetki.ru')).toBe('https://api.triotmetki.ru/blog/rss.xml');
  });
});

describe('toggledTag', () => {
  it('selects the newly clicked tag instead of the current one', () => {
    expect(toggledTag({ current: 'meta', next: ['meta', 'patch'] })).toBe('patch');
  });

  it('clears the tag when the current one is clicked again', () => {
    expect(toggledTag({ current: 'meta', next: [] })).toBeNull();
  });

  it('selects the first tag when none was active', () => {
    expect(toggledTag({ current: null, next: ['patch'] })).toBe('patch');
  });
});
