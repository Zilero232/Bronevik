import { describe, expect, it } from 'vitest';

import { CODE_COUNTDOWN } from '../../../config/code-countdown.constants';
import { codeLifetime, formatCountdown } from '../code-countdown';

const ISSUED_AT = Date.UTC(2026, 8, 25, 12, 0, 0);
const TTL_MS = 15 * 60_000;
const TTL_SECONDS = TTL_MS / CODE_COUNTDOWN.msInSecond;
const EXPIRES_AT = new Date(ISSUED_AT + TTL_MS).toISOString();

describe('formatCountdown', () => {
  it('pads seconds to two digits', () => {
    expect(formatCountdown(CODE_COUNTDOWN.secondsInMinute + 5)).toBe('1:05');
  });

  it('keeps minutes past an hour unwrapped', () => {
    expect(formatCountdown(61 * CODE_COUNTDOWN.secondsInMinute)).toBe('61:00');
  });

  it('never shows a negative clock', () => {
    expect(formatCountdown(-5)).toBe(formatCountdown(0));
  });

  it('drops fractions of a second', () => {
    expect(formatCountdown(9.9)).toBe(formatCountdown(9));
  });
});

describe('codeLifetime', () => {
  it('starts full at the moment of issue', () => {
    const lifetime = codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT });

    expect(lifetime.left).toBe(TTL_SECONDS);
    expect(lifetime.left).toBe(lifetime.total);
  });

  it('keeps the total fixed while the time left drains', () => {
    const lifetime = codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS / 4 });

    expect(lifetime.total).toBe(TTL_SECONDS);
    expect(lifetime.left / lifetime.total).toBeCloseTo(0.75);
  });

  it('rounds a partial second up so the clock never reads zero too early', () => {
    expect(codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS - 200 }).left).toBe(1);
  });

  it('reaches zero exactly on the deadline and stays there', () => {
    expect(codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS }).left).toBe(0);
    expect(codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS * 2 }).left).toBe(0);
  });

  it('treats a clock that runs behind the issue time as a full fuse', () => {
    const lifetime = codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT - 5_000 });

    expect(lifetime.left).toBe(lifetime.total);
  });

  it('never reports a zero total, so a ratio is always defined', () => {
    expect(codeLifetime({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT + TTL_MS * 2, now: ISSUED_AT + TTL_MS * 2 }).total).toBeGreaterThan(0);
  });
});
