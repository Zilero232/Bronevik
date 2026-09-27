import { describe, expect, it } from 'vitest';

import { selectFields } from '..';

describe('selectFields', () => {
  it('keeps listed paths and drops excluded ones', () => {
    const value = { a: 1, b: { c: 2, d: 3 }, list: [{ x: 1, y: 2 }] };

    expect(selectFields({ value, fields: ['a', 'b.c'] })).toEqual({ a: 1, b: { c: 2 } });
    expect(selectFields({ value, fields: ['-b.d', '-list'] })).toEqual({ a: 1, b: { c: 2 } });
    expect(selectFields({ value, fields: ['list.x'] })).toEqual({ list: [{ x: 1 }] });
  });
});
