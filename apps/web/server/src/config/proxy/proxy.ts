import { filter, isEmpty, map, pipe } from 'remeda';

import type { Env } from '../env';

import { PROXY } from './proxy.constants';

export const trustedProxies = (env: Pick<Env, 'TRUSTED_PROXIES'>): string[] =>
  pipe(
    env.TRUSTED_PROXIES.split(','),
    map((proxy) => proxy.trim()),
    filter((proxy) => !isEmpty(proxy))
  );

export const expressTrustProxy = (env: Pick<Env, 'TRUSTED_PROXIES'>): number | string[] => {
  const proxies = trustedProxies(env);

  return proxies.length > 0 ? proxies : PROXY.defaultHops;
};
