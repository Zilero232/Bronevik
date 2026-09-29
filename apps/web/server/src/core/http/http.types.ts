import type { Options } from 'ky';

export type HttpRequestInput = {
  url: string;
  options?: Options;
};
