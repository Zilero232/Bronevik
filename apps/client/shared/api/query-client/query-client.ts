import { QueryClient } from '@tanstack/react-query';

import { isServer } from '@/shared/lib';

import { QUERY_CLIENT_DEFAULTS } from './query-client.constants';

export const makeQueryClient = () => new QueryClient({ defaultOptions: QUERY_CLIENT_DEFAULTS });

export const queryClient = makeQueryClient();

export const getQueryClient = () => (isServer() ? makeQueryClient() : queryClient);
