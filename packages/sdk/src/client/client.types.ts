import type { RetryOptions } from '../retry';

export type BronevikClientOptions = {
  apiKey: string;
  baseUrl?: string;
  retry?: false | RetryOptions;
  fetch?: typeof globalThis.fetch;
};
