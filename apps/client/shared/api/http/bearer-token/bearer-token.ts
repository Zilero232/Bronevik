import { STORAGE_KEYS } from '@/shared/constants';
import { isBrowser } from '@/shared/lib';

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

export const bearerToken = {
  get: read,
  set: (token: string) => {
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEYS.bearerToken, token);
    }
  },
  clear: () => {
    if (isBrowser()) {
      window.localStorage.removeItem(STORAGE_KEYS.bearerToken);
    }
  }
} as const;
