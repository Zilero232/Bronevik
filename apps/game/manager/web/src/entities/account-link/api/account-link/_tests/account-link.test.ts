import link from '@contract/account-link.json';
import { describe, expect, it } from 'vitest';

import { accountLinkSchema } from '@/entities/account-link';

describe('accountLinkSchema', () => {
  it('parses the site bindings the Rust core found, without their secrets', () => {
    const parsed = accountLinkSchema.parse(link);

    expect(parsed.selected).toBe(parsed.accounts[0]?.accountId);
    expect(Object.keys(link.accounts[0] ?? {})).not.toContain('secret');
  });
});
