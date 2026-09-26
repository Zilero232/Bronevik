import type { RetryOptions } from 'ky';

export type BronevikClientOptions = {
  apiKey: string;
  baseUrl?: string;
  retry?: false | RetryOptions;
  fetch?: typeof globalThis.fetch;
};
