import axios from 'axios';

import { env } from '@/shared/config/client-env';

import { bearerToken } from './bearer-token';

export const api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL, timeout: 10_000 });

api.interceptors.request.use((config) => {
  const token = bearerToken.get();

  if (token && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});
