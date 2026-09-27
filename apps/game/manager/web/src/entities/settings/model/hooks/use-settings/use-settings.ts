import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getSettings } from '../../../api';

export const useSettings = () => useQuery({ queryKey: QUERY_KEYS.settings, queryFn: getSettings });
