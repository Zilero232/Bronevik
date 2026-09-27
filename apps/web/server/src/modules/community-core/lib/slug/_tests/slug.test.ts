import { describe, expect, it } from 'vitest';

import { titleSlug } from '../slug';

describe('titleSlug', () => {
  it('transliterates a Russian title into a URL-safe slug', () => {
    expect(titleSlug({ title: 'Как играть на Т-34', suffix: 'ab12' })).toMatch(/^[\w-]+-ab12$/);
  });

  it('falls back when the title has no usable characters', () => {
    expect(titleSlug({ title: '!!!', suffix: 'x1' })).toBe('guide-x1');
  });
});
