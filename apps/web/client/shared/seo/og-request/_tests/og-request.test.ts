import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, LOCALES } from '@/shared/i18n';

import { parseOgPlayerRequest } from '../og-request';

const OTHER_LOCALE = LOCALES.find((locale) => locale !== DEFAULT_LOCALE) ?? DEFAULT_LOCALE;

describe('parseOgPlayerRequest', () => {
  it('reads a numeric account id', () => {
    expect(parseOgPlayerRequest({ id: '12345', locale: null })?.accountId).toBe(12_345);
  });

  it.each(['0', '-5', 'abc', '12abc', '1e3', ' 12', '1.5', ''])('rejects %j as an account id', (id) => {
    expect(parseOgPlayerRequest({ id, locale: null })).toBeNull();
  });

  it('rejects an id too long to be a Lesta account', () => {
    expect(parseOgPlayerRequest({ id: '9'.repeat(20), locale: null })).toBeNull();
  });

  it('defaults to the default locale without a query parameter', () => {
    expect(parseOgPlayerRequest({ id: '1', locale: null })?.locale).toBe(DEFAULT_LOCALE);
  });

  it('honours a supported locale', () => {
    expect(parseOgPlayerRequest({ id: '1', locale: OTHER_LOCALE })?.locale).toBe(OTHER_LOCALE);
  });

  it('falls back to the default locale for an unknown one', () => {
    expect(parseOgPlayerRequest({ id: '1', locale: 'xx' })?.locale).toBe(DEFAULT_LOCALE);
  });
});
