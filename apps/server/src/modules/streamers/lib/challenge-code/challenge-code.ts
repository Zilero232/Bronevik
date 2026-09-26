import { CHALLENGE } from '../../config';

const CODE_TOKEN = new RegExp(String.raw`${CHALLENGE.codePrefix}?\b([${CHALLENGE.codeAlphabet}]{${CHALLENGE.codeLength}})\b`, 'gu');

export const extractChallengeCodes = (message: string): string[] =>
  [...message.toUpperCase().matchAll(CODE_TOKEN)].flatMap((found) => (found[1] ? [found[1]] : []));
