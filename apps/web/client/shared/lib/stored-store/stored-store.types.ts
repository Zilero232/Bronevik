export type CreateStoredStoreInput<T> = {
  key: string;
  parse: (value: unknown) => T;
};

export type StoredStore<T> = {
  read: () => T;
  subscribe: (onChange: () => void) => () => void;
  write: (value: T | null) => void;
  update: (next: (current: T) => T) => void;
};
