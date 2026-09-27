import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { listProfiles } from '../../../api';

export const useProfiles = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.profiles(clientPath), queryFn: () => listProfiles(clientPath), enabled: clientPath !== null });
