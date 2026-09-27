import { describe, expect, it } from 'vitest';

import { newsKind } from '../news-feed';

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
