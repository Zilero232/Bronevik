import { INTERNAL_REQUEST } from '@otmetki/schemas';
import axios from 'axios';

import { env } from '@/shared/config/client-env';
import { serverEnv } from '@/shared/config/server-env';
import { isServer } from '@/shared/lib';

import { bearerToken } from './bearer-token';

export const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, timeout: 10_000 });

api.interceptors.request.use((config) => {
  const token = bearerToken.get();

  if (token && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  if (isServer()) {
    config.headers.set(INTERNAL_REQUEST.tokenHeader, serverEnv().INTERNAL_API_TOKEN);
  }

  return config;
});
