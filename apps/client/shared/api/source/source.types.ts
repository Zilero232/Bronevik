export type FromSourceInput<T> = {
  mock: () => T;
  fetch: () => Promise<T>;
  signal?: AbortSignal;
};
