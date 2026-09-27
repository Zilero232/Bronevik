import { QueryClient } from '@tanstack/react-query';

import { QUERY } from '../../config';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: QUERY.staleTimeMs, retry: QUERY.retries },
      mutations: { retry: false }
    }
  });
