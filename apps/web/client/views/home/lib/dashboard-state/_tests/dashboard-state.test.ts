import { describe, expect, it } from 'vitest';

import { dashboardState } from '../dashboard-state';

const READY = { isReady: true, hasPlayer: true, hasProfile: true, isMissing: false, isError: false };

describe('dashboardState', () => {
  it('waits for the browser before it knows whether a nickname is stored', () => {
    expect(dashboardState({ ...READY, isReady: false })).toBe('pending');
  });

  it('asks for a nickname when none is stored', () => {
    expect(dashboardState({ ...READY, hasPlayer: false, hasProfile: false })).toBe('ask');
  });

  it('shows the numbers once the profile is there, even if a side section failed', () => {
    expect(dashboardState({ ...READY, isError: true })).toBe('ready');
  });

  it('tells a missing player apart from a server that did not answer', () => {
    expect(dashboardState({ ...READY, hasProfile: false, isMissing: true, isError: true })).toBe('missing');
    expect(dashboardState({ ...READY, hasProfile: false, isError: true })).toBe('error');
    expect(dashboardState({ ...READY, hasProfile: false })).toBe('loading');
  });
});
