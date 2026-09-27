import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { listSnapshots } from '../../../api';

export const useSnapshots = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.snapshots(clientPath), queryFn: () => listSnapshots(clientPath), enabled: clientPath !== null });
