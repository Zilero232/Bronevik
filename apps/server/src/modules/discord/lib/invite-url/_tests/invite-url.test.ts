import { describe, expect, it } from 'vitest';

import { inviteUrl } from '../invite-url';

describe('inviteUrl', () => {
  it('asks for the bot and slash-command scopes with role management', () => {
    const url = new URL(inviteUrl('123'));

    expect(url.searchParams.get('client_id')).toBe('123');
    expect(url.searchParams.get('scope')).toBe('bot applications.commands');
    expect(BigInt(url.searchParams.get('permissions') ?? '0') & (1n << 28n)).toBe(1n << 28n);
  });
});
