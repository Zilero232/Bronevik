import { randomInt } from 'node:crypto';

import { CHALLENGE } from '../../config';

const CODE_TOKEN = new RegExp(String.raw`${CHALLENGE.codePrefix}?\b([${CHALLENGE.codeAlphabet}]{${CHALLENGE.codeLength}})\b`, 'gu');

export const generateChallengeCode = (): string =>
  Array.from({ length: CHALLENGE.codeLength }, () => CHALLENGE.codeAlphabet[randomInt(CHALLENGE.codeAlphabet.length)]).join('');

export const extractChallengeCodes = (message: string): string[] =>
  [...message.toUpperCase().matchAll(CODE_TOKEN)].flatMap((found) => (found[1] ? [found[1]] : []));
