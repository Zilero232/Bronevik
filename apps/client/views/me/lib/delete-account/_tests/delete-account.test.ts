import { describe, expect, it } from 'vitest';

import { deleteAccountFormSchema } from '../delete-account';

const NICKNAME = 'Grom_Tanker';

const confirms = (confirmation: string) => deleteAccountFormSchema(NICKNAME).safeParse({ confirmation }).success;

describe('deleteAccountFormSchema', () => {
  it('accepts the exact nickname, ignoring surrounding spaces', () => {
    expect(confirms(NICKNAME)).toBe(true);
    expect(confirms(`  ${NICKNAME} `)).toBe(true);
  });

  it('rejects an empty, partial or differently cased confirmation', () => {
    expect(confirms('')).toBe(false);
    expect(confirms(NICKNAME.slice(0, -1))).toBe(false);
    expect(confirms(NICKNAME.toLowerCase())).toBe(false);
  });

  it('never confirms while the nickname is unknown', () => {
    const unknown = deleteAccountFormSchema('');

    expect(unknown.safeParse({ confirmation: '' }).success).toBe(false);
    expect(unknown.safeParse({ confirmation: '   ' }).success).toBe(false);
  });
});
