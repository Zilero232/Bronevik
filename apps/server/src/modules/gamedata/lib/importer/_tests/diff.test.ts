import { describe, expect, it } from 'vitest';

import { diffSpecs } from '../diff';

describe('diffSpecs', () => {
  it('reports changed leaves with their path', () => {
    expect(diffSpecs({ before: { top: { reloadTime: 12.3, hp: 1230 } }, after: { top: { reloadTime: 11.9, hp: 1230 } } })).toEqual([
      { path: 'top.reloadTime', before: 12.3, after: 11.9 }
    ]);
  });

  it('keys arrays of named objects by name instead of position', () => {
    const before = {
      guns: [
        { name: 'a', reload: 5 },
        { name: 'b', reload: 7 }
      ]
    };

    const after = {
      guns: [
        { name: 'b', reload: 6 },
        { name: 'a', reload: 5 }
      ]
    };

    expect(diffSpecs({ before, after })).toEqual([{ path: 'guns.b.reload', before: 7, after: 6 }]);
  });

  it('lists added and removed leaves', () => {
    expect(diffSpecs({ before: { a: 1 }, after: { b: { c: 2 } } })).toEqual([
      { path: 'a', before: 1 },
      { path: 'b.c', after: 2 }
    ]);
  });

  it('returns nothing for identical specs', () => {
    const spec = { tier: 7, armor: [120, 90, 60], guns: [{ name: 'x', shells: { ap: { damage: 390 } } }] };

    expect(diffSpecs({ before: spec, after: structuredClone(spec) })).toEqual([]);
  });
});
