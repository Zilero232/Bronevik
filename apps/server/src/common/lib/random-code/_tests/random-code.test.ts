import { describe, expect, it } from 'vitest';

import { randomCode } from '../random-code';

const INPUT = { alphabet: 'ABC234', length: 8 } as const;

describe('randomCode', () => {
  it('produces a code of the requested length from the alphabet only', () => {
    const code = randomCode(INPUT);

    expect(code).toHaveLength(INPUT.length);
    expect([...code].every((char) => INPUT.alphabet.includes(char))).toBe(true);
  });
});
