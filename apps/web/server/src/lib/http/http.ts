import ky from 'ky';

import { HTTP } from './http.constants';

export const http = ky.create({
  headers: { 'user-agent': HTTP.userAgent },
  timeout: HTTP.timeoutMs,
  retry: 0
});
