import { describe, expect, it } from 'vitest';

import type { MiniAppModeInput } from '../mini-app-mode.types';

import { resolveMiniAppMode } from '../mini-app-mode';

const BROWSER_GUEST: MiniAppModeInput = { env: 'browser', signInStatus: 'idle', hasSession: false, isSessionPending: false };
const TELEGRAM: MiniAppModeInput = { ...BROWSER_GUEST, env: 'inside' };

describe('resolveMiniAppMode', () => {
  it('waits while the environment is still being detected, whatever else is known', () => {
    expect(resolveMiniAppMode({ ...BROWSER_GUEST, env: 'detecting', hasSession: true })).toBe('loading');
  });

  it('keeps loading inside Telegram until the sign-in settles', () => {
    expect(resolveMiniAppMode(TELEGRAM)).toBe('loading');
    expect(resolveMiniAppMode({ ...TELEGRAM, signInStatus: 'pending' })).toBe('loading');
  });

  it('shows the dashboard once the Telegram sign-in succeeds', () => {
    expect(resolveMiniAppMode({ ...TELEGRAM, signInStatus: 'success' })).toBe('dashboard');
  });

  it('reports a failed Telegram sign-in even when a web session exists', () => {
    expect(resolveMiniAppMode({ ...TELEGRAM, signInStatus: 'error', hasSession: true })).toBe('failed');
  });

  it('sends a signed-out browser visitor to the open-in-Telegram screen', () => {
    expect(resolveMiniAppMode(BROWSER_GUEST)).toBe('outside');
  });

  it('previews the dashboard in a browser that is already signed in on the web', () => {
    expect(resolveMiniAppMode({ ...BROWSER_GUEST, hasSession: true })).toBe('preview');
  });

  it('does not flash the outside screen while the web session is still loading', () => {
    expect(resolveMiniAppMode({ ...BROWSER_GUEST, isSessionPending: true })).toBe('loading');
  });
});
