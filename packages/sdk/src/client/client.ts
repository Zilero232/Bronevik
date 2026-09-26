import type { Client } from '../generated/client';
import type { OtmetkiClientOptions } from './client.types';

import { createClient, createConfig } from '../generated/client';
import { restoreErrorBody } from '../lib';
import { OTMETKI_API, OTMETKI_RETRY } from './client.constants';

export const createOtmetkiClient = ({ apiKey, baseUrl = OTMETKI_API.baseUrl, retry = {}, fetch = globalThis.fetch }: OtmetkiClientOptions): Client =>
  createClient(
    createConfig({
      baseUrl,
      auth: () => apiKey,
      retry: retry === false ? 0 : { ...OTMETKI_RETRY, ...retry },
      kyOptions: { fetch, throwHttpErrors: true, hooks: { beforeError: [restoreErrorBody] } }
    })
  );
