import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getCatalog } from '../../../api';

export const useCatalog = () => useQuery({ queryKey: QUERY_KEYS.catalog, queryFn: getCatalog });
