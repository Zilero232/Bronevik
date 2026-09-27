import { describe, expect, it } from 'vitest';

import { MAGIC_LINK_FORM_DEFAULT_VALUES } from '../../../config/magic-link-form.constants';
import { magicLinkFormSchema } from '../magic-link-form';

describe('magicLinkFormSchema', () => {
  it('accepts a well-formed address', () => {
    expect(magicLinkFormSchema.safeParse({ email: 'player@example.com' }).success).toBe(true);
  });

  it('rejects the empty default so the form cannot submit untouched', () => {
    expect(magicLinkFormSchema.safeParse(MAGIC_LINK_FORM_DEFAULT_VALUES).success).toBe(false);
  });

  it('rejects an address without a domain', () => {
    expect(magicLinkFormSchema.safeParse({ email: 'player@' }).success).toBe(false);
  });
});
