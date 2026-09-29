import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { listSets } from '../../../api';

export const useComponentSets = () => useQuery({ queryKey: QUERY_KEYS.sets, queryFn: listSets });
