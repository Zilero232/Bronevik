import type { RetryOptions } from 'ky';

export type OtmetkiClientOptions = {
  apiKey: string;
  baseUrl?: string;
  retry?: false | RetryOptions;
  fetch?: typeof globalThis.fetch;
};
