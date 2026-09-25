import { unique } from 'remeda';

import type { SearchCandidates } from './layout-switch.types';

import { KEYBOARD, PATTERNS, TRANSLIT } from './layout-switch.constants';

const toCyrillic = new Map([...KEYBOARD.latin].map((key, index) => [key, KEYBOARD.cyrillic[index] ?? key]));
const toLatin = new Map([...KEYBOARD.cyrillic].map((key, index) => [key, KEYBOARD.latin[index] ?? key]));

const swapChar = (char: string): string => {
  const lower = char.toLowerCase();
  const swapped = toCyrillic.get(lower) ?? toLatin.get(lower);

  if (swapped === undefined) {
    return char;
  }

  return char === lower ? swapped : swapped.toUpperCase();
};

export const switchLayout = (text: string): string => [...text].map(swapChar).join('');

export const transliterate = (text: string): string =>
  [...text]
    .map((char) => {
      const latin = TRANSLIT[char.toLowerCase()];

      if (latin === undefined) {
        return char;
      }

      return char === char.toLowerCase() ? latin : latin.charAt(0).toUpperCase() + latin.slice(1);
    })
    .join('');

const hasCyrillic = (text: string): boolean => PATTERNS.cyrillic.test(text);

const isNicknameLike = (text: string): boolean => PATTERNS.nickname.test(text);

export const escapeLike = (text: string): string => text.replace(PATTERNS.likeSpecial, (char) => `\\${char}`);

export const searchCandidates = (query: string): SearchCandidates => {
  const original = query.trim();
  const switched = switchLayout(original);
  const all = unique([
    original,
    switched,
    ...(hasCyrillic(original) ? [transliterate(original)] : []),
    ...(hasCyrillic(switched) ? [transliterate(switched)] : [])
  ]);

  return {
    all,
    nicknames: all.filter(isNicknameLike)
  };
};
