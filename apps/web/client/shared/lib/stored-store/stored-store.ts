import type { CreateStoredStoreInput, StoredStore } from './stored-store.types';

const parseJson = (raw: string | null): unknown => {
  try {
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
};

export const createStoredStore = <T>({ key, parse }: CreateStoredStoreInput<T>): StoredStore<T> => {
  const listeners = new Set<() => void>();
  const cache = new Map<string | null, T>();

  const readRaw = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const read = (): T => {
    const raw = readRaw();
    const cached = cache.get(raw);

    if (cached !== undefined) {
      return cached;
    }

    const value = parse(parseJson(raw));

    cache.clear();
    cache.set(raw, value);

    return value;
  };

  const subscribe = (onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === key) {
        onChange();
      }
    };

    listeners.add(onChange);
    window.addEventListener('storage', onStorage);

    return () => {
      listeners.delete(onChange);
      window.removeEventListener('storage', onStorage);
    };
  };

  const write = (value: T | null) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      return;
    }

    listeners.forEach((listener) => listener());
  };

  return { read, subscribe, write, update: (next) => write(next(read())) };
};
