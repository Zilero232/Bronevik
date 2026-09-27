import { describe, expect, it } from 'vitest';

import { pickLocalized } from '../localized';

describe('pickLocalized', () => {
  it('returns the text of the locale', () => {
    expect(pickLocalized({ text: { ru: 'Ядро', en: 'Core' }, locale: 'en' })).toBe('Core');
  });

  it('falls back to Russian when the locale has no text', () => {
    expect(pickLocalized({ text: { ru: 'Ядро', en: '' }, locale: 'en' })).toBe('Ядро');
  });
});
