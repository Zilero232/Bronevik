import { filter, isEmpty, map, pipe, unique } from 'remeda';

import type { Env } from './env.schema';

const originOf = (url: string): string | null => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

export const allowedOrigins = (env: Pick<Env, 'CORS_ORIGINS' | 'WEB_URL'>): string[] => {
  const extra = pipe(
    env.CORS_ORIGINS.split(','),
    map((origin) => origin.trim()),
    filter((origin) => !isEmpty(origin))
  );

  const web = originOf(env.WEB_URL);

  return unique([...(web ? [web] : []), ...extra]);
};
