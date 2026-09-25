import { describe, expect, it } from 'vitest';

import { newsKind, toNewsItems } from '../news-feed';
import { NEWS_FEED } from '../news-feed.constants';

const now = new Date('2026-09-24T12:00:00Z');

describe('toNewsItems', () => {
  it('drops items without a link or a title', () => {
    expect(toNewsItems({ items: [{ title: 'x' }, { link: 'https://tanki.su/a' }], now })).toEqual([]);
  });

  it('falls back to the observation time for an unparsable date', () => {
    const [item] = toNewsItems({ items: [{ title: 'x', link: 'https://tanki.su/a', pubDate: 'garbage' }], now });

    expect(item?.publishedAt).toEqual(now);
  });

  it('caps the summary length', () => {
    const [item] = toNewsItems({
      items: [{ title: 'x', link: 'https://tanki.su/a', contentSnippet: 'a'.repeat(NEWS_FEED.summaryLength * 2) }],
      now
    });

    expect(item?.summary).toHaveLength(NEWS_FEED.summaryLength);
  });
});

describe('newsKind', () => {
  it('recognises patch notes', () => {
    expect(newsKind({ title: 'Обновление 2.1: список изменений' })).toBe('patchNotes');
  });

  it('defaults to news', () => {
    expect(newsKind({ title: 'Скидки выходного дня' })).toBe('news');
  });
});

describe('newsKind categories', () => {
  it('reads xml2js category objects without throwing', () => {
    expect(newsKind({ title: 'Акция', categories: [{ _: 'Обновление', $: { domain: 'x' } }, Object.create(null)] })).toBe('patchNotes');
  });
});
