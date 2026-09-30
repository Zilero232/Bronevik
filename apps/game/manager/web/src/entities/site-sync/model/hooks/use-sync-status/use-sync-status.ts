import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getSyncStatus } from '../../../api';

export const useSyncStatus = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.syncStatus(clientPath), queryFn: () => getSyncStatus(clientPath) });
