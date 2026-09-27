import { describe, expect, it } from 'vitest';

import { TELEGRAM_BOT } from '@/shared/config';

import { botLink, botName, codeDeepLink } from '../bot-link';

describe('botName', () => {
  it('falls back to the configured bot when the server does not name one', () => {
    expect(botName(null)).toBe(TELEGRAM_BOT.username);
    expect(botName('')).toBe(TELEGRAM_BOT.username);
  });

  it('strips a leading at-sign', () => {
    expect(botName('@SomeBot')).toBe('SomeBot');
  });
});

describe('botLink', () => {
  it('points at the bot on t.me', () => {
    expect(new URL(botLink({ username: 'SomeBot' })).pathname).toBe('/SomeBot');
  });

  it('carries the start payload as a query parameter', () => {
    expect(new URL(botLink({ username: 'SomeBot', start: 'ABC123' })).searchParams.get('start')).toBe('ABC123');
  });

  it('leaves the start parameter out when there is no payload', () => {
    expect(new URL(botLink({ username: 'SomeBot' })).searchParams.has('start')).toBe(false);
  });
});

describe('codeDeepLink', () => {
  const EXPIRES_AT = new Date(Date.UTC(2026, 8, 25, 12, 15)).toISOString();

  it('prefers the link the server issued with the code', () => {
    const deepLink = 'https://t.me/OtherBot?start=XYZ';

    expect(codeDeepLink({ code: { code: 'ABC123', expiresAt: EXPIRES_AT, deepLink }, botUsername: 'SomeBot' })).toBe(deepLink);
  });

  it('builds a start link carrying the code when the server sends none', () => {
    const link = codeDeepLink({ code: { code: 'ABC123', expiresAt: EXPIRES_AT, deepLink: null }, botUsername: 'SomeBot' });

    expect(link).toBe(botLink({ username: 'SomeBot', start: 'ABC123' }));
  });
});
