import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';

export const useSetsView = () => {
  const { clientPath } = useSelectedClient();
  const { data: installation } = useInstallation(clientPath);
  const enabled = installation?.components.filter((component) => component.state === 'enabled').map((component) => component.id) ?? [];

  return { enabled, canSave: enabled.length > 0 };
};
