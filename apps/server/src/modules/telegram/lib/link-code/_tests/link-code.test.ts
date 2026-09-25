import { describe, expect, it } from 'vitest';

import { LINK_CODE } from '../../../config';
import { generateLinkCode, looksLikeLinkCode, normaliseLinkCode } from '../link-code';

describe('link codes', () => {
  it('generates codes that the bot recognises', () => {
    const code = generateLinkCode();

    expect(code).toHaveLength(LINK_CODE.length);
    expect(looksLikeLinkCode(code)).toBe(true);
  });

  it('accepts a code typed in lower case with spaces', () => {
    expect(looksLikeLinkCode(' abcd efgh ')).toBe(true);
    expect(normaliseLinkCode(' abcd efgh ')).toBe('ABCDEFGH');
  });

  it('rejects characters outside the unambiguous alphabet', () => {
    expect(looksLikeLinkCode('ABCDEFG0')).toBe(false);
    expect(looksLikeLinkCode('/start')).toBe(false);
  });
});
