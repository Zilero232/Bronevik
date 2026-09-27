import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { prepareInstall } from '../../../api';

export const useInstallPlan = (clientPath: string | null) =>
  useQuery({ queryKey: QUERY_KEYS.installPlan(clientPath), queryFn: () => prepareInstall(clientPath), enabled: clientPath !== null });
