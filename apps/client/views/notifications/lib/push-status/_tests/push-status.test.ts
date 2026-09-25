import { describe, expect, it } from 'vitest';

import type { PushStatusInput } from '..';

import { resolvePushStatus } from '..';

const READY: PushStatusInput = {
  isReady: true,
  isSupported: true,
  permission: 'default',
  publicKey: 'key',
  isSubscribed: false
};

describe('resolvePushStatus', () => {
  it('waits until the browser has been inspected', () => {
    expect(resolvePushStatus({ ...READY, isReady: false, isSupported: false })).toBe('loading');
  });

  it('reports an unsupported browser before the server key arrives', () => {
    expect(resolvePushStatus({ ...READY, isSupported: false, publicKey: undefined })).toBe('unsupported');
  });

  it('waits for the server key', () => {
    expect(resolvePushStatus({ ...READY, publicKey: undefined })).toBe('loading');
  });

  it('reports a server without push configured', () => {
    expect(resolvePushStatus({ ...READY, publicKey: null })).toBe('unconfigured');
  });

  it('prefers an existing subscription over the permission state', () => {
    expect(resolvePushStatus({ ...READY, isSubscribed: true })).toBe('subscribed');
  });

  it('reports a blocked permission', () => {
    expect(resolvePushStatus({ ...READY, permission: 'denied' })).toBe('denied');
  });

  it('offers to subscribe otherwise', () => {
    expect(resolvePushStatus(READY)).toBe('idle');
    expect(resolvePushStatus({ ...READY, permission: 'granted' })).toBe('idle');
  });
});
