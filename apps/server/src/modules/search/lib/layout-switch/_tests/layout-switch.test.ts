import { describe, expect, it } from 'vitest';

import { escapeLike, searchCandidates, switchLayout, transliterate } from '../layout-switch';
import { KEYBOARD } from '../layout-switch.constants';

describe('switchLayout', () => {
  it('maps a nickname typed on the Russian layout back to Latin', () => {
    expect(switchLayout('тулш')).toBe('neki');
  });

  it('maps Latin keys to the Russian letters on the same keys', () => {
    expect(switchLayout('ytrb')).toBe('неки');
  });

  it('is its own inverse on every key of both layouts', () => {
    const keys = `${KEYBOARD.latin}${KEYBOARD.cyrillic}`;

    expect(switchLayout(switchLayout(keys))).toBe(keys);
  });

  it('keeps the case of each letter', () => {
    expect(switchLayout('Ytrb')).toBe('Неки');
  });

  it('leaves digits and underscores alone', () => {
    expect(switchLayout('_42')).toBe('_42');
  });
});

describe('transliterate', () => {
  it('turns every Cyrillic letter into Latin or nothing', () => {
    const output = transliterate(KEYBOARD.cyrillic);

    expect(output).toMatch(/^[a-z]*$/);
  });

  it('spells a Russian word the way players write their nicknames', () => {
    expect(transliterate('неки')).toBe('neki');
  });

  it('keeps the short spellings players use for ё and х', () => {
    expect(transliterate('Хрёнь')).toBe('Hren');
  });

  it('keeps the case of the first letter of a digraph', () => {
    expect(transliterate('Щука')).toBe('Schuka');
  });
});

describe('searchCandidates', () => {
  it('turns "ytrb" into the intended nickname "neki"', () => {
    expect(searchCandidates('ytrb').nicknames).toContain('neki');
  });

  it('always keeps the query itself first', () => {
    expect(searchCandidates('Neki').all[0]).toBe('Neki');
  });

  it('offers only nickname-shaped strings as nickname candidates', () => {
    const { nicknames } = searchCandidates('ис-7');

    expect(nicknames.every((candidate) => /^\w+$/.test(candidate))).toBe(true);
  });

  it('keeps Cyrillic candidates for tank names', () => {
    expect(searchCandidates('bc7').all).toContain('ис7');
  });

  it('never returns the same candidate twice', () => {
    const { all } = searchCandidates('neki');

    expect(new Set(all).size).toBe(all.length);
  });
});

describe('escapeLike', () => {
  it('escapes every LIKE wildcard so underscores in nicknames match literally', () => {
    expect(escapeLike('a_b%c\\')).toBe('a\\_b\\%c\\\\');
  });
});
