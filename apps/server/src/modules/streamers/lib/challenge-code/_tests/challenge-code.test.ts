import { describe, expect, it } from 'vitest';

import { CHALLENGE } from '../../../config';
import { extractChallengeCodes, generateChallengeCode } from '../challenge-code';

describe('generateChallengeCode', () => {
  it('produces a code that can be read back from a message', () => {
    const code = generateChallengeCode();

    expect(code).toHaveLength(CHALLENGE.codeLength);
    expect(extractChallengeCodes(`donate ${CHALLENGE.codePrefix}${code}!`)).toEqual([code]);
  });
});

describe('extractChallengeCodes', () => {
  it('does not read a code out of a longer word', () => {
    expect(extractChallengeCodes('ABCDEFGH')).toEqual([]);
  });

  it('finds every code in a message', () => {
    expect(extractChallengeCodes('#ABCDE and #XYZ23')).toEqual(['ABCDE', 'XYZ23']);
  });
});
