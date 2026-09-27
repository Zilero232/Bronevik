import { describe, expect, it } from 'vitest';

import { registrationFormSchema } from '..';

describe('registrationFormSchema', () => {
  it('allows registering without a team name', () => {
    expect(registrationFormSchema.safeParse({ accountId: 'primary', teamName: '  ' }).success).toBe(true);
  });

  it('rejects a one-letter team name', () => {
    expect(registrationFormSchema.safeParse({ accountId: 'primary', teamName: 'A' }).success).toBe(false);
  });

  it('rejects a team name over the server limit', () => {
    expect(registrationFormSchema.safeParse({ accountId: 'primary', teamName: 'x'.repeat(41) }).success).toBe(false);
  });
});
