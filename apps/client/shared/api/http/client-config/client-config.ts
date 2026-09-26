import type { CreateClientConfig } from '../../generated/client.gen';

import { api } from '../http';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  axios: api,
  querySerializer: { array: { explode: false, style: 'form' } }
});
