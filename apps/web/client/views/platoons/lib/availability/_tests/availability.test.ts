import { describe, expect, it } from 'vitest';

import { availabilityWindow } from '../availability';

const NOW = new Date('2026-09-26T18:00:00Z');

describe('availabilityWindow', () => {
  it('is anytime without bounds', () => {
    expect(availabilityWindow({ from: null, until: null, now: NOW }).state).toBe('anytime');
  });

  it('is now inside the window', () => {
    expect(availabilityWindow({ from: '2026-09-26T17:00:00Z', until: '2026-09-26T20:00:00Z', now: NOW }).state).toBe('now');
  });

  it('is later before the window opens', () => {
    expect(availabilityWindow({ from: '2026-09-26T19:00:00Z', until: null, now: NOW }).state).toBe('later');
  });

  it('is ended once the window closed', () => {
    expect(availabilityWindow({ from: null, until: '2026-09-26T17:59:00Z', now: NOW }).state).toBe('ended');
  });

  it('counts the exact start instant as now', () => {
    expect(availabilityWindow({ from: '2026-09-26T18:00:00Z', until: null, now: NOW }).state).toBe('now');
  });

  it('treats a bounded window as open until the clock is known', () => {
    expect(availabilityWindow({ from: '2026-09-26T19:00:00Z', until: '2026-09-26T17:59:00Z', now: null }).state).toBe('now');
  });

  it('returns parsed bounds for display', () => {
    expect(availabilityWindow({ from: '2026-09-26T19:00:00Z', until: null, now: NOW }).from?.toISOString()).toBe('2026-09-26T19:00:00.000Z');
  });
});
