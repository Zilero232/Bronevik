import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getAccountLink } from '../../../api';

export const useAccountLink = () => useQuery({ queryKey: QUERY_KEYS.accountLink, queryFn: getAccountLink });
