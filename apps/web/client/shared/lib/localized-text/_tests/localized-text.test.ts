import { describe, expect, it } from 'vitest';

import { localizedText } from '../localized-text';
import { LOCALIZED_TEXT } from '../localized-text.constants';

describe('localizedText', () => {
  it('shows the English name on the English site', () => {
    expect(localizedText({ locale: LOCALIZED_TEXT.english, text: 'Карелия', english: 'Karelia' })).toBe('Karelia');
  });

  it('keeps the Russian name on the Russian site and when no English name is synced yet', () => {
    expect(localizedText({ locale: 'ru', text: 'Карелия', english: 'Karelia' })).toBe('Карелия');
    expect(localizedText({ locale: LOCALIZED_TEXT.english, text: 'Карелия', english: null })).toBe('Карелия');
    expect(localizedText({ locale: LOCALIZED_TEXT.english, text: 'Карелия', english: '' })).toBe('Карелия');
  });
});

describe('localizedText with an optional text', () => {
  it('fills a missing Russian description from the English one only on the English site', () => {
    expect(localizedText({ locale: LOCALIZED_TEXT.english, text: null, english: 'Rocky hills' })).toBe('Rocky hills');
    expect(localizedText({ locale: 'ru', text: null, english: 'Rocky hills' })).toBeNull();
  });
});
