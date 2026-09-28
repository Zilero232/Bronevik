import { describe, expect, it } from 'vitest';

import { toCsv } from '../data-file';
import { DATA_FILE } from '../data-file.constants';

describe('toCsv', () => {
  it('returns an empty file for no rows', () => {
    expect(toCsv([])).toBe('');
  });

  it('writes a header from the first row and one line per row', () => {
    const csv = toCsv([
      { tankId: 1, battles: 10 },
      { tankId: 2, battles: 0 }
    ]);

    expect(csv.split(DATA_FILE.csvNewline).filter(Boolean)).toEqual(['tankId,battles', '1,10', '2,0']);
  });

  it('quotes separators, quotes and line breaks and keeps empty values empty', () => {
    const csv = toCsv([{ name: 'a,"b"', note: 'x\ny', missing: null, zero: 0 }]);

    expect(csv.split(DATA_FILE.csvNewline)[1]).toBe('"a,""b""","x\ny",,0');
  });
});

describe('toCsv booleans', () => {
  it('writes booleans as words', () => {
    expect(toCsv([{ isActive: true, isHidden: false }])).toBe(`isActive,isHidden${DATA_FILE.csvNewline}true,false${DATA_FILE.csvNewline}`);
  });
});
