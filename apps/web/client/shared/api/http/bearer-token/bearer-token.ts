import { STORAGE_KEYS } from '@/shared/constants';
import { isBrowser } from '@/shared/lib/env';

const read = () => {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEYS.bearerToken);
  } catch {
    return null;
  }
};

const write = (apply: (storage: Storage) => void) => {
  if (!isBrowser()) {
    return;
  }

  try {
    apply(window.localStorage);
  } catch {}
};

export const bearerToken = {
  get: read,
  set: (token: string) => write((storage) => storage.setItem(STORAGE_KEYS.bearerToken, token)),
  clear: () => write((storage) => storage.removeItem(STORAGE_KEYS.bearerToken))
} as const;
