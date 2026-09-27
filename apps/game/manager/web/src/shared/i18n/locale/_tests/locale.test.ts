import { describe, expect, it } from 'vitest';

import { resolveLocale } from '../locale';

describe('resolveLocale', () => {
  it('keeps an explicit choice whatever the system says', () => {
    expect(resolveLocale({ language: 'en', systemLanguage: 'ru-RU' })).toBe('en');
    expect(resolveLocale({ language: 'ru', systemLanguage: 'en-US' })).toBe('ru');
  });

  it('follows the system language when set to automatic', () => {
    expect(resolveLocale({ language: 'auto', systemLanguage: 'ru-RU' })).toBe('ru');
    expect(resolveLocale({ language: 'auto', systemLanguage: 'de-DE' })).toBe('en');
  });

  it('falls back to Russian without a system language', () => {
    expect(resolveLocale({ language: 'auto', systemLanguage: undefined })).toBe('ru');
  });
});
