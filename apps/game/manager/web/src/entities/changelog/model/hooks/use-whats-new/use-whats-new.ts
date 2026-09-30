import { useQuery } from '@tanstack/react-query';

import { QUERY, QUERY_KEYS } from '@/shared/config';

import { getWhatsNew } from '../../../api';

export const useWhatsNew = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.whatsNew(clientPath), queryFn: () => getWhatsNew(clientPath), staleTime: QUERY.whatsNewStaleTimeMs });
