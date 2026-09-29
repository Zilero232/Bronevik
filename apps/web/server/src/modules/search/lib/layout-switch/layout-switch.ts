import toLatin from '@sindresorhus/transliterate';
import { unique } from 'remeda';

import type { SearchCandidates } from './layout-switch.types';

import { KEYBOARD, PATTERNS, TRANSLIT } from './layout-switch.constants';

const toCyrillic = new Map([...KEYBOARD.latin].map((key, index) => [key, KEYBOARD.cyrillic[index] ?? key]));
const toLatinKey = new Map([...KEYBOARD.cyrillic].map((key, index) => [key, KEYBOARD.latin[index] ?? key]));

const swapChar = (char: string): string => {
  const lower = char.toLowerCase();
  const swapped = toCyrillic.get(lower) ?? toLatinKey.get(lower);

  if (swapped === undefined) {
    return char;
  }

  return char === lower ? swapped : swapped.toUpperCase();
};

export const switchLayout = (text: string): string => [...text].map(swapChar).join('');

const customReplacements = new Map(TRANSLIT.replacements);

export const transliterate = (text: string): string => toLatin(text, { customReplacements });

const hasCyrillic = (text: string): boolean => PATTERNS.cyrillic.test(text);

const isNicknameLike = (text: string): boolean => PATTERNS.nickname.test(text);

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
