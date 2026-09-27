import { describe, expect, it } from 'vitest';

import { parseLiteralAt, readAssignment } from '../python-literal';

describe('parseLiteralAt', () => {
  it('reads dicts, lists, tuples, strings, numbers and keywords with trailing commas', () => {
    const { value } = parseLiteralAt({ source: "{'a': [1, 2.5, -3,], 'b': ('x', \"y\"), 'c': True, 'd': None, 'e': False, 1: 'it\\'s'}", start: 0 });

    expect(value).toEqual({
      kind: 'dict',
      entries: { a: [1, 2.5, -3], b: ['x', 'y'], c: true, d: null, e: false, 1: "it's" }
    });
  });

  it('keeps dotted names and calls with keyword arguments', () => {
    const { value } = parseLiteralAt({
      source: "[PROGRESS_TEMPLATE.VALUE, DESCRIPTIONS.REGULAR(iconID=CONDITION_ICON.WIN, limiterID='x')]",
      start: 0
    });

    expect(value).toEqual([
      { kind: 'name', name: 'PROGRESS_TEMPLATE.VALUE' },
      { kind: 'call', name: 'DESCRIPTIONS.REGULAR', args: [], kwargs: { iconID: { kind: 'name', name: 'CONDITION_ICON.WIN' }, limiterID: 'x' } }
    ]);
  });

  it('reports where a malformed literal breaks', () => {
    expect(() => parseLiteralAt({ source: "{'a' 1}", start: 0 })).toThrow(/expected ":"/);
  });
});

describe('readAssignment', () => {
  it('reads the literal assigned to a module-level name', () => {
    const source = "from x import Y\n_config = {'q': {'win': 1}}\n_other = [1]\n";

    expect(readAssignment({ source, name: '_config' })).toEqual({ kind: 'dict', entries: { q: { kind: 'dict', entries: { win: 1 } } } });
    expect(readAssignment({ source, name: '_missing' })).toBeUndefined();
  });
});
