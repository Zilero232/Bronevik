import { describe, expect, it } from 'vitest';

import { MANAGER_ERROR_CODES } from '@/shared/api';
import { PAGE_IDS } from '@/shared/config';

import { MESSAGES } from '../messages';

const leaves = (value: unknown): unknown[] =>
  typeof value === 'object' && value !== null ? Object.values(value).flatMap((nested) => leaves(nested)) : [value];

const keyPaths = (value: unknown, prefix = ''): string[] =>
  typeof value === 'object' && value !== null
    ? Object.entries(value).flatMap(([key, nested]) => keyPaths(nested, `${prefix}${key}.`))
    : [prefix.slice(0, -1)];

describe('MESSAGES', () => {
  it('has the same keys in Russian and English', () => {
    expect(keyPaths(MESSAGES.en).toSorted()).toEqual(keyPaths(MESSAGES.ru).toSorted());
  });

  it('has no empty text', () => {
    const texts = leaves(MESSAGES);

    expect(texts.every((text) => typeof text === 'string' && text.trim().length > 0)).toBe(true);
  });

  it('names every page of the navigation', () => {
    expect(PAGE_IDS.every((page) => page in MESSAGES.ru.nav)).toBe(true);
  });

  it('explains every error code the app can report', () => {
    expect(MANAGER_ERROR_CODES.every((code) => code in MESSAGES.ru.errors)).toBe(true);
  });
});
