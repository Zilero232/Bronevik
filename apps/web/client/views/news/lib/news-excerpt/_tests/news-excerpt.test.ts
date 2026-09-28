import { describe, expect, it } from 'vitest';

import { newsExcerpt } from '../news-excerpt';

describe('newsExcerpt', () => {
  it('drops the feed link boilerplate', () => {
    expect(newsExcerpt('Читать дальше\n    \n         Обсудить на форуме')).toBeNull();
  });

  it('keeps real text and collapses whitespace', () => {
    expect(newsExcerpt('Новый режим  уже\n в игре. Читать дальше')).toBe('Новый режим уже в игре.');
  });

  it('returns null for an empty summary', () => {
    expect(newsExcerpt(null)).toBeNull();
  });
});
