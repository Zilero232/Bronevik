import type { QueryClient } from '@tanstack/react-query';

export type PrefetchQueries = (client: QueryClient) => Promise<unknown>[];
