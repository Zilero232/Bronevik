import { describe, expect, it } from 'vitest';

import { fontSafe, fontSafeData, fontSafeLines } from '../font-safe';
import { FONT_SAFE } from '../font-safe.constants';

const unsafe = (text: string): string[] =>
  Array.from(text).filter((char) => (char.codePointAt(0) ?? 0) >= FONT_SAFE.firstUnsafe && !FONT_SAFE.kept.includes(char));

describe(fontSafe, () => {
  it('swaps the characters the client font lacks for ones it has', () => {
    expect(fontSafe('−1 200 ≈ 2 862 → ★✓')).toBe('-1 200 ~ 2 862 › *+');
  });

  it('leaves Cyrillic, the kept punctuation and ASCII alone', () => {
    expect(fontSafe('Урон — 1 200 · № 5…')).toBe('Урон — 1 200 · № 5…');
  });

  it('drops a symbol it has no replacement for', () => {
    expect(fontSafe('a☃b')).toBe('ab');
  });

  it.each(Object.entries(FONT_SAFE.replacements))('replaces %j with text the font has', (_char, replacement) => {
    expect(unsafe(replacement)).toEqual([]);
  });
});

describe(fontSafeData, () => {
  it('cleans every string of a widget payload and keeps the rest', () => {
    expect(fontSafeData({ a: ['−5', 3, null], b: { c: '≈ 1' }, d: true })).toEqual({ a: ['-5', 3, null], b: { c: '~ 1' }, d: true });
  });
});

describe(fontSafeLines, () => {
  it('cleans the text runs of a label', () => {
    const [line] = fontSafeLines([{ key: '0', runs: [{ key: '0', kind: 'text', text: '−310', style: {} }] }]);

    expect(line?.runs[0]).toMatchObject({ text: '-310' });
  });
});
