import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getInstallation } from '../../../api';

export const useInstallation = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.installation(clientPath), queryFn: () => getInstallation(clientPath), enabled: clientPath !== null });
