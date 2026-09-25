import type { Client } from '../generated/client';
import type { BronevikClientOptions } from './client.types';

import { createClient, createConfig } from '../generated/client';
import { retryingFetch } from '../retry';
import { BRONEVIK_API } from './client.constants';

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
      fetch: retry === false ? fetch : retryingFetch({ ...retry, fetch })
    })
  );
