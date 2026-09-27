import { describe, expect, it } from 'vitest';

import { Prisma } from '../../../../../generated';
import { parseJsonText, readNumber, readRecord, toJsonValue } from '../json';

describe('toJsonValue', () => {
  it('passes plain JSON through', () => {
    expect(toJsonValue({ a: [1, 'b', null] })).toEqual({ a: [1, 'b', null] });
  });

  it('maps null and non-JSON values to the Prisma JSON null', () => {
    expect(toJsonValue(null)).toBe(Prisma.JsonNull);
    expect(toJsonValue(() => 1)).toBe(Prisma.JsonNull);
  });
});

describe('readers', () => {
  it('reads only finite numbers', () => {
    expect(readNumber(5)).toBe(5);
    expect(readNumber('5')).toBeNull();
    expect(readNumber(Number.NaN)).toBeNull();
  });

  it('reads a record or falls back to empty', () => {
    expect(readRecord({ a: 1 })).toEqual({ a: 1 });
    expect(readRecord([1])).toEqual({});
  });
});

describe('parseJsonText', () => {
  it('parses JSON and turns a corrupt cache entry into null instead of throwing', () => {
    expect(parseJsonText('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonText('{broken')).toBeNull();
  });
});
