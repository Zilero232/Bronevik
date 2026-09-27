import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { parseTankiListing } from '../tanki-listing';

const fixture = (name: string) => load(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));
const baseUrl = 'https://tanki.su/ru/news/special-offers/';

describe('parseTankiListing', () => {
  it('reads every preview of the saved special offers page', () => {
    const items = parseTankiListing({ $: fixture('tanki-special-offers.html'), baseUrl });

    expect(items).toHaveLength(3);
    expect(items[1]?.title).toBe('Празднуем День танкиста!');

    for (const item of items) {
      expect(item.url.startsWith('https://tanki.su/ru/news/special-offers/')).toBe(true);
      expect(item.image?.startsWith('https://')).toBe(true);
      expect(item.publishedAt).toBeInstanceOf(Date);
    }
  });

  it('reads the saved game events page the same way', () => {
    const titles = parseTankiListing({ $: fixture('tanki-game-events.html'), baseUrl }).map((item) => item.title);

    expect(titles).toContain('Натиск: Огненный сокол');
  });

  it('returns nothing for a page without previews', () => {
    expect(parseTankiListing({ $: load('<html><body><p>maintenance</p></body></html>'), baseUrl })).toEqual([]);
  });
});
