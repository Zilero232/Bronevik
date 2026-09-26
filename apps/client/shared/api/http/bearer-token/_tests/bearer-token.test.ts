import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/shared/constants';

import { bearerToken } from '..';

const TOKEN = 'token-value';

const denyStorage = () => {
  const denied = () => {
    throw new DOMException('storage is disabled', 'SecurityError');
  };

  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denied);
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(denied);
};

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.removeItem(STORAGE_KEYS.bearerToken);
});

describe('bearerToken', () => {
  it('returns null when no token was stored', () => {
    expect(bearerToken.get()).toBeNull();
  });

  it('reads back the token it stored', () => {
    bearerToken.set(TOKEN);

    expect(bearerToken.get()).toBe(TOKEN);
  });

  it('forgets the token after clear', () => {
    bearerToken.set(TOKEN);
    bearerToken.clear();

    expect(bearerToken.get()).toBeNull();
  });

  it('treats unreadable storage as no token', () => {
    window.localStorage.setItem(STORAGE_KEYS.bearerToken, TOKEN);
    denyStorage();

    expect(bearerToken.get()).toBeNull();
  });

  it('does not throw when storage refuses writes', () => {
    denyStorage();

    expect(() => bearerToken.set(TOKEN)).not.toThrow();
    expect(() => bearerToken.clear()).not.toThrow();
  });
});
