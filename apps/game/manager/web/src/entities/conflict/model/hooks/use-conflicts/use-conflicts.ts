import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getConflicts } from '../../../api';

export const useConflicts = (clientPath: string | null, enabled: boolean) =>
  useQuery({ queryKey: QUERY_KEYS.conflicts(clientPath), queryFn: () => getConflicts(clientPath), enabled: clientPath !== null && enabled });
