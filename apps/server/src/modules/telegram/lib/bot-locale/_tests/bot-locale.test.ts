import { describe, expect, it } from 'vitest';

import { resolveBotLocale } from '../bot-locale';

describe('resolveBotLocale', () => {
  it('maps language codes onto the bot locales and falls back to Russian', () => {
    expect(resolveBotLocale('en-GB')).toBe('en');
    expect(resolveBotLocale('uk')).toBe('ru');
    expect(resolveBotLocale(undefined)).toBe('ru');
  });
});
