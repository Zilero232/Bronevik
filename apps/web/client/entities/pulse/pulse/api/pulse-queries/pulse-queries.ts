import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getPulse } from '../pulse';

export const pulseQueries = {
  current: () => queryOptions({ queryKey: QUERY_KEYS.pulse, queryFn: ({ signal }) => getPulse({ signal }) })
};
