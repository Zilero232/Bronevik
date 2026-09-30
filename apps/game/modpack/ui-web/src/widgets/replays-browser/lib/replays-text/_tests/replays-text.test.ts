import { describe, expect, it } from 'vitest';

import { REPLAYS_EN, REPLAYS_RU } from '../../../config';
import { replaysText } from '../replays-text';

describe(replaysText, () => {
  it('has every string in both languages', () => {
    expect(Object.keys(REPLAYS_EN).sort()).toEqual(Object.keys(REPLAYS_RU).sort());
    expect(Object.values(REPLAYS_EN).every((text) => text.trim() !== '')).toBe(true);
  });

  it('fills the named placeholders and keeps an unknown one', () => {
    const t = replaysText('en');

    expect(t('watchVersion', { version: '1.44.1.0', client: '1.45.0.0' })).toContain('1.44.1.0');
    expect(t('watchVersion', { version: '1.44.1.0', client: '1.45.0.0' })).toContain('1.45.0.0');
    expect(t('removeConfirm')).toContain('{name}');
  });

  it('keeps the same placeholders in both languages', () => {
    const placeholders = (text: string): string[] => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? '').sort();
    const english = new Map<string, string>(Object.entries(REPLAYS_EN));

    expect(
      Object.entries(REPLAYS_RU)
        .filter(([key, text]) => placeholders(text).join() !== placeholders(english.get(key) ?? '').join())
        .map(([key]) => key)
    ).toEqual([]);
  });
});
