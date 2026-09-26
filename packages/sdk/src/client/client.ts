import type { Client } from '../generated/client';
import type { BronevikClientOptions } from './client.types';

import { createClient, createConfig } from '../generated/client';
import { restoreErrorBody } from '../lib';
import { BRONEVIK_API, BRONEVIK_RETRY } from './client.constants';

export const createBronevikClient = ({
  apiKey,
  baseUrl = BRONEVIK_API.baseUrl,
  retry = {},
  fetch = globalThis.fetch
}: BronevikClientOptions): Client =>
  createClient(
    createConfig({
      baseUrl,
      auth: () => apiKey,
      retry: retry === false ? 0 : { ...BRONEVIK_RETRY, ...retry },
      kyOptions: { fetch, throwHttpErrors: true, hooks: { beforeError: [restoreErrorBody] } }
    })
  );
