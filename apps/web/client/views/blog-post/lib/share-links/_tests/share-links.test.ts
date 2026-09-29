import { describe, expect, it } from 'vitest';

import { ARTICLE_SHARE } from '../../../config';
import { shareLinks } from '../share-links';

const INPUT = { url: 'https://triotmetki.ru/blog/patch?x=1&y=2', title: 'Разбор & итоги' };

describe('shareLinks', () => {
  it('offers every configured target', () => {
    expect(shareLinks(INPUT).map(({ target }) => target)).toEqual(Object.keys(ARTICLE_SHARE.targets));
  });

  it('keeps the page URL and title intact inside the share URL', () => {
    shareLinks(INPUT).forEach(({ target, href }) => {
      const params = new URL(href).searchParams;

      expect(params.get('url')).toBe(INPUT.url);
      expect(params.get(ARTICLE_SHARE.targets[target].titleParam)).toBe(INPUT.title);
    });
  });

  it('opens each target on its own host', () => {
    shareLinks(INPUT).forEach(({ target, href }) => {
      expect(new URL(href).host).toBe(new URL(ARTICLE_SHARE.targets[target].url).host);
    });
  });
});
