import { describe, expect, it } from 'vitest';

import { parseXvmExpectedValues, toXvmExpectedValues } from '..';

const XVM_FILE = {
  header: { version: '2026-09-24', source: 'xvm' },
  data: [
    { IDNum: 1, expDef: 0.95, expFrag: 1.07, expSpot: 1.43, expDamage: 1260.15, expWinRate: 53.2 },
    { IDNum: '3329', expDef: '0.62', expFrag: '0.88', expSpot: '1.05', expDamage: '2489.3', expWinRate: '51.7' }
  ]
};

describe('parseXvmExpectedValues', () => {
  it('parses numbers and numeric strings into a table keyed by tank id', () => {
    const { header, table } = parseXvmExpectedValues(XVM_FILE);

    expect(header.version).toBe(XVM_FILE.header.version);
    expect(table.size).toBe(XVM_FILE.data.length);
    expect(table.get(3329)).toEqual({ tankId: 3329, expDef: 0.62, expFrag: 0.88, expSpot: 1.05, expDamage: 2489.3, expWinRate: 51.7 });
  });

  it('accepts raw JSON text', () => {
    expect(parseXvmExpectedValues(JSON.stringify(XVM_FILE)).table.get(1)?.expDamage).toBe(1260.15);
  });

  it('rejects a file with a non-numeric value', () => {
    expect(() => parseXvmExpectedValues({ data: [{ ...XVM_FILE.data[0], expDamage: 'n/a' }] })).toThrow();
  });

  it('round-trips through the XVM shape', () => {
    const { table } = parseXvmExpectedValues(XVM_FILE);

    expect(parseXvmExpectedValues(toXvmExpectedValues(table)).table).toEqual(table);
  });
});
