const NUMERALS = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
] as const;

export const TIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export type Tier = (typeof TIERS)[number];

export const toRoman = (value: number) => {
  let rest = Math.max(0, Math.floor(value));
  let result = '';

  for (const [amount, glyph] of NUMERALS) {
    while (rest >= amount) {
      result += glyph;
      rest -= amount;
    }
  }

  return result;
};
