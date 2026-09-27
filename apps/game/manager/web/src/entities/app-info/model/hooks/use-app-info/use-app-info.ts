import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getAppInfo } from '../../../api';

export const useAppInfo = () => useQuery({ queryKey: QUERY_KEYS.appInfo, queryFn: getAppInfo, staleTime: Infinity });
