import { subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { historyWindow } from '../history-window';

const now = new Date('2026-09-26T12:00:00Z');
const free = { limitDays: 90, defaultDays: 90 };
const full = { limitDays: 730, defaultDays: 730 };

describe('historyWindow', () => {
  it('defaults to the policy window ending now', () => {
    expect(historyWindow({ from: undefined, to: undefined, now, policy: free })).toEqual({ from: subDays(now, 90), to: now });
  });

  it('clips a free request further back than 90 days', () => {
    const window = historyWindow({ from: subDays(now, 400).toISOString(), to: undefined, now, policy: free });

    expect(window.from).toEqual(subDays(now, 90));
  });

  it('measures the free limit from now, not from a past end date', () => {
    const to = subDays(now, 300).toISOString();
    const window = historyWindow({ from: subDays(now, 350).toISOString(), to, now, policy: free });

    expect(window).toEqual({ from: new Date(to), to: new Date(to) });
  });

  it('gives the full stored window to a full policy', () => {
    const window = historyWindow({ from: subDays(now, 400).toISOString(), to: undefined, now, policy: full });

    expect(window.from).toEqual(subDays(now, 400));
  });

  it('keeps a request exactly on the limit', () => {
    const window = historyWindow({ from: subDays(now, 90).toISOString(), to: undefined, now, policy: free });

    expect(window.from).toEqual(subDays(now, 90));
  });

  it('keeps a request inside the limit untouched', () => {
    const from = subDays(now, 10).toISOString();

    expect(historyWindow({ from, to: undefined, now, policy: free }).from).toEqual(new Date(from));
  });
});
