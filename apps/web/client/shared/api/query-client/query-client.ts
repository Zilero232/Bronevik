import { QueryClient } from '@tanstack/react-query';

import { isServer } from '@/shared/lib';

import { createMutationCache } from './mutation-feedback';
import { QUERY_CLIENT_DEFAULTS, SERVER_QUERY_CLIENT_DEFAULTS } from './query-client.constants';

const makeQueryClient = () => new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULTS, mutationCache: createMutationCache() });

export const makeServerQueryClient = () => new QueryClient({ defaultOptions: SERVER_QUERY_CLIENT_DEFAULTS });

export const queryClient = makeQueryClient();

export const getQueryClient = () => (isServer() ? makeServerQueryClient() : queryClient);
