import { describe, expect, it } from 'vitest';

import { CLAIM_PROFILE } from '../../../config';
import { manualClaimSchema } from '../claim-form';

describe('manualClaimSchema', () => {
  it('asks for enough evidence for a moderator to check', () => {
    expect(manualClaimSchema.safeParse({ evidence: '   short   ' }).success).toBe(false);
    expect(manualClaimSchema.safeParse({ evidence: 'https://t.me/nick/42 — пост со ссылкой на страницу' }).success).toBe(true);
  });

  it('trims the evidence and caps its length', () => {
    expect(manualClaimSchema.parse({ evidence: '  https://t.me/nick/42  ' }).evidence).toBe('https://t.me/nick/42');
    expect(manualClaimSchema.safeParse({ evidence: 'x'.repeat(CLAIM_PROFILE.evidenceMax + 1) }).success).toBe(false);
  });
});
