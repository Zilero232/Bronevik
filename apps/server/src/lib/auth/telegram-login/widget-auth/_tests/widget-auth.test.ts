import { createHash, createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { WidgetPayload } from '../../telegram-login.types';

import { verifyWidgetPayload, widgetIdentity } from '../widget-auth';
import { WIDGET_AUTH } from '../widget-auth.constants';

const BOT_TOKEN = '123456:test-token';
const NOW = new Date('2026-09-24T12:00:00.000Z');

const sign = (payload: WidgetPayload): string => {
  const secret = createHash('sha256').update(BOT_TOKEN).digest();
  const data = Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(WIDGET_AUTH.separator);

  return createHmac('sha256', secret).update(data).digest('hex');
};

const signed = (overrides: WidgetPayload = {}): WidgetPayload => {
  const payload = { id: '42', first_name: 'Test', username: 'tanker', auth_date: String(Math.floor(NOW.getTime() / 1000)), ...overrides };

  return { ...payload, hash: sign(payload) };
};

describe('verifyWidgetPayload', () => {
  it('accepts a payload signed with the bot token', () => {
    expect(verifyWidgetPayload({ payload: signed(), botToken: BOT_TOKEN, now: NOW })).toBe(true);
  });

  it('refuses an edited field', () => {
    expect(verifyWidgetPayload({ payload: { ...signed(), id: '43' }, botToken: BOT_TOKEN, now: NOW })).toBe(false);
  });

  it('refuses another bot token and an empty one', () => {
    expect(verifyWidgetPayload({ payload: signed(), botToken: 'other', now: NOW })).toBe(false);
    expect(verifyWidgetPayload({ payload: signed(), botToken: '', now: NOW })).toBe(false);
  });

  it('refuses a payload older than the replay window', () => {
    const later = new Date(NOW.getTime() + (WIDGET_AUTH.maxAgeSeconds + 60) * 1000);

    expect(verifyWidgetPayload({ payload: signed(), botToken: BOT_TOKEN, now: later })).toBe(false);
  });
});

describe('widgetIdentity', () => {
  it('reads the Telegram id as a bigint', () => {
    expect(widgetIdentity(signed())?.telegramId).toBe(42n);
  });

  it('rejects a non-numeric id', () => {
    expect(widgetIdentity(signed({ id: 'abc' }))).toBeNull();
  });
});
