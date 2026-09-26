import { describe, expect, it } from 'vitest';

import { messages } from '..';
import { LOCALES } from '../../locale';

const leaves = (value: unknown, prefix = ''): [string, unknown][] => {
  if (typeof value !== 'object' || value === null) {
    return [[prefix, value]];
  }

  return Object.entries(value).flatMap(([key, nested]) => leaves(nested, prefix ? `${prefix}.${key}` : key));
};

describe('messages', () => {
  it('carries every locale the router serves', () => {
    expect(Object.keys(messages).sort()).toEqual([...LOCALES].sort());
  });

  it('holds the same keys in every locale, so no page falls back to a raw key', () => {
    const [reference, ...rest] = LOCALES.map((locale) =>
      leaves(messages[locale])
        .map(([key]) => key)
        .sort()
    );

    rest.forEach((keys) => expect(keys).toEqual(reference));
  });

  it('leaves no value empty', () => {
    LOCALES.forEach((locale) => {
      const empty = leaves(messages[locale]).filter(([, value]) => typeof value !== 'string' || value.trim() === '');

      expect(empty).toEqual([]);
    });
  });

  it('carries the Lesta attribution the terms require', () => {
    LOCALES.forEach((locale) => {
      expect(messages[locale].footer.lestaCopyright).toMatch(/Лест|Lesta/);
      expect(messages[locale].footer.dataSource).toMatch(/Лест|Lesta/);
    });
  });
});
