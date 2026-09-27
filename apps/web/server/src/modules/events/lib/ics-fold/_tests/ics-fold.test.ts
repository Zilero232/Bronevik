import { describe, expect, it } from 'vitest';

import { foldIcsOctets } from '../ics-fold';

describe('foldIcsOctets', () => {
  it('keeps every physical line within 75 octets without splitting a Cyrillic letter', () => {
    const folded = foldIcsOctets(`BEGIN:VEVENT\r\nSUMMARY:${'Линия фронта '.repeat(20)}\r\nEND:VEVENT`);

    for (const line of folded.split('\r\n')) {
      expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
      expect(line).not.toContain('�');
    }

    expect(folded.replaceAll('\r\n ', '')).toBe(`BEGIN:VEVENT\r\nSUMMARY:${'Линия фронта '.repeat(20)}\r\nEND:VEVENT`);
  });

  it('refolds lines the generator folded by characters', () => {
    const byCharacters = `DESCRIPTION:${'я'.repeat(63)}\r\n\t${'я'.repeat(20)}`;

    expect(
      foldIcsOctets(byCharacters)
        .split('\r\n')
        .every((line) => Buffer.byteLength(line) <= 75)
    ).toBe(true);
  });
});
