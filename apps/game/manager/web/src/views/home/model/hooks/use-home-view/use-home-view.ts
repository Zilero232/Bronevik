import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';

export const useHomeView = () => {
  const { query, clientPath } = useSelectedClient();
  const installationQuery = useInstallation(clientPath);
  const isLoading = query.isPending || (clientPath !== null && installationQuery.isPending);

  return { isLoading, isInstalled: installationQuery.data?.installed ?? false };
};
