import { describe, expect, it } from 'vitest';

import { countdown, formatCountdown } from '../code-countdown';

const ISSUED_AT = Date.UTC(2026, 8, 25, 12, 0, 0);
const TTL_MS = 15 * 60_000;
const EXPIRES_AT = new Date(ISSUED_AT + TTL_MS).toISOString();

describe('formatCountdown', () => {
  it('pads seconds to two digits', () => {
    expect(formatCountdown(65)).toBe('1:05');
  });

  it('keeps minutes past an hour unwrapped', () => {
    expect(formatCountdown(61 * 60)).toBe('61:00');
  });

  it('never shows a negative clock', () => {
    expect(formatCountdown(-5)).toBe(formatCountdown(0));
  });

  it('drops fractions of a second', () => {
    expect(formatCountdown(9.9)).toBe(formatCountdown(9));
  });
});

describe('countdown', () => {
  it('starts full at the moment of issue', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT });

    expect(state.ratio).toBe(1);
    expect(state.left).toBe(TTL_MS / 1_000);
    expect(state.isExpired).toBe(false);
  });

  it('drains proportionally to the time spent', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS / 4 });

    expect(state.ratio).toBeCloseTo(0.75);
  });

  it('rounds a partial second up so the clock never reads zero too early', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS - 200 });

    expect(state.left).toBe(1);
    expect(state.isExpired).toBe(false);
  });

  it('expires exactly on the deadline', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS });

    expect(state.isExpired).toBe(true);
    expect(state.ratio).toBe(0);
  });

  it('stays at zero past the deadline', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT + TTL_MS * 2 });

    expect(state.left).toBe(0);
    expect(state.label).toBe(formatCountdown(0));
  });

  it('treats a clock that runs behind the issue time as a full fuse', () => {
    const state = countdown({ expiresAt: EXPIRES_AT, issuedAt: ISSUED_AT, now: ISSUED_AT - 5_000 });

    expect(state.ratio).toBe(1);
  });
});
