import type { DefaultedQueryObserverOptions, DefaultError, QueryKey, QueryObserverOptions } from '@tanstack/react-query';

import { QueryClient } from '@tanstack/react-query';

import { isServer } from '@/shared/lib/env';

import { createMutationCache } from './mutation-feedback';
import { QUERY_CLIENT_DEFAULTS, SERVER_QUERY_CLIENT_DEFAULTS, SERVER_RENDER_STALE_TIME } from './query-client.constants';

class ServerRenderQueryClient extends QueryClient {
  override defaultQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never
  >(
    options:
      | DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
      | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>
  ): DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    return { ...super.defaultQueryOptions(options), staleTime: SERVER_RENDER_STALE_TIME };
  }
}

const makeQueryClient = () => new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULTS, mutationCache: createMutationCache() });

export const makeServerQueryClient = () => new QueryClient({ defaultOptions: SERVER_QUERY_CLIENT_DEFAULTS });

const makeServerRenderQueryClient = () => new ServerRenderQueryClient({ defaultOptions: SERVER_QUERY_CLIENT_DEFAULTS });

const queryClient = makeQueryClient();

export const getQueryClient = () => (isServer() ? makeServerRenderQueryClient() : queryClient);
