import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { useSnapshots } from '@/entities/snapshot';

export const useBackupsView = () => {
  const { clientPath } = useSelectedClient();
  const { data: installation } = useInstallation(clientPath);
  const { data: snapshots } = useSnapshots(clientPath);

  return { clientPath, isInstalled: installation?.installed ?? false, hasSnapshots: (snapshots?.length ?? 0) > 0 };
};
