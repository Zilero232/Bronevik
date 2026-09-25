import { describe, expect, it } from 'vitest';

import { guideSlug, toAuthorView, toPlayerStats } from '../community-views';

describe('guideSlug', () => {
  it('transliterates a Russian title into a URL-safe slug', () => {
    expect(guideSlug({ title: 'Как играть на Т-34', suffix: 'ab12' })).toMatch(/^[\w-]+-ab12$/);
  });

  it('falls back when the title has no usable characters', () => {
    expect(guideSlug({ title: '!!!', suffix: 'x1' })).toBe('guide-x1');
  });
});

describe('toAuthorView', () => {
  it('drops an avatar that is not an http URL', () => {
    expect(toAuthorView({ id: 'u', name: 'n', image: 'data:image/png;base64,AAA' }).image).toBeNull();
  });
});

describe('toPlayerStats', () => {
  it('returns null when the player has no rating yet', () => {
    expect(toPlayerStats(null)).toBeNull();
    expect(toPlayerStats({ battles: 10, winRate: 0.5, wn8: null })).toEqual({ battles: 10, winRate: 0.5, wn8: null });
  });
});
